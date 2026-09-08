const { execFileSync } = require('node:child_process');
const { appendFileSync, readFileSync } = require('node:fs');
const { resolve } = require('node:path');

function run(cwd, command, args) {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function git(cwd, ...args) {
  return run(cwd, 'git', args);
}

function marker(runId) {
  if (!/^\d+$/.test(runId || ''))
    throw new Error('Missing valid GitHub run ID');
  return `Npm-Release-Run: ${runId}`;
}

function manifest(cwd) {
  return JSON.parse(readFileSync(resolve(cwd, 'package.json'), 'utf8'));
}

function checkVersionFiles(cwd, version) {
  const lock = JSON.parse(
    readFileSync(resolve(cwd, 'package-lock.json'), 'utf8'),
  );
  if (
    !/^\d+\.\d+\.\d+$/.test(version) ||
    manifest(cwd).version !== version ||
    lock.version !== version ||
    lock.packages[''].version !== version
  ) {
    throw new Error(
      'Release version must match both version files and be a stable version',
    );
  }
}

function requireClean(cwd) {
  if (git(cwd, 'status', '--porcelain')) {
    throw new Error('Release checkout must be clean');
  }
}

async function isPublished(name, version) {
  const url = `https://registry.npmjs.org/${encodeURIComponent(
    name,
  )}/${encodeURIComponent(version)}?release-check=${Date.now()}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (response.status === 404) return false;
  if (!response.ok)
    throw new Error(`npm registry lookup failed: HTTP ${response.status}`);
  const published = await response.json();
  if (published.name !== name || published.version !== version) {
    throw new Error('npm registry returned unexpected package metadata');
  }
  return true;
}

async function prepare({ cwd, runId, releaseType, lookup = isPublished }) {
  const runMarker = marker(runId);
  if (!['patch', 'minor', 'major'].includes(releaseType)) {
    throw new Error('Release type must be patch, minor, or major');
  }
  requireClean(cwd);
  git(cwd, 'fetch', 'origin', 'main');
  const main = git(cwd, 'rev-parse', 'origin/main');
  // The run ID stays the same when GitHub reruns a failed workflow.
  const previous = git(
    cwd,
    'log',
    main,
    '-1',
    '--format=%H',
    `--grep=^${runMarker}$`,
  );
  if (!previous && git(cwd, 'rev-parse', 'HEAD') !== main) {
    throw new Error(
      'main advanced after this run was requested; start a new workflow run',
    );
  }
  git(cwd, 'checkout', '--detach', previous || main);
  if (!previous) {
    run(cwd, 'npm', [
      'version',
      releaseType,
      '--no-git-tag-version',
      '--ignore-scripts',
    ]);
  }
  const { name, version } = manifest(cwd);
  checkVersionFiles(cwd, version);
  const published = await lookup(name, version);
  if (published && !previous) {
    throw new Error(
      `Version ${version} is already published; reconcile main with npm before releasing`,
    );
  }
  if (previous && !published) {
    const mainVersion = JSON.parse(
      git(cwd, 'show', `${main}:package.json`),
    ).version;
    if (mainVersion !== version) {
      throw new Error(
        `Release ${version} was superseded by ${mainVersion}; refusing to publish an older release`,
      );
    }
  }
  return { version, retry: Boolean(previous), published };
}

function commit({ cwd, runId, version, retry }) {
  const runMarker = marker(runId);
  checkVersionFiles(cwd, version);
  if (retry) {
    requireClean(cwd);
    if (!git(cwd, 'log', '-1', '--format=%B').split('\n').includes(runMarker)) {
      throw new Error('Retry checkout does not match this workflow run');
    }
    git(cwd, 'fetch', 'origin', 'main');
    git(cwd, 'merge-base', '--is-ancestor', 'HEAD', 'origin/main');
    const mainVersion = JSON.parse(
      git(cwd, 'show', 'origin/main:package.json'),
    ).version;
    if (mainVersion !== version) {
      throw new Error(
        `Release ${version} was superseded by ${mainVersion}; refusing to publish an older release`,
      );
    }
    return git(cwd, 'rev-parse', 'HEAD');
  }
  const changed = git(cwd, 'diff', '--name-only', 'HEAD').split('\n').sort();
  if (
    changed.join(',') !== 'package-lock.json,package.json' ||
    git(cwd, 'ls-files', '--others', '--exclude-standard')
  ) {
    throw new Error(
      'Release checks changed files other than the version files',
    );
  }
  git(cwd, 'add', 'package.json', 'package-lock.json');
  git(
    cwd,
    '-c',
    'user.name=github-actions[bot]',
    '-c',
    'user.email=41898282+github-actions[bot]@users.noreply.github.com',
    'commit',
    '--signoff',
    '-m',
    `chore(release): v${version}`,
    '-m',
    runMarker,
  );
  // A normal push fails if main advanced during validation. Never overwrite it.
  git(cwd, 'push', 'origin', 'HEAD:refs/heads/main');
  return git(cwd, 'rev-parse', 'HEAD');
}

async function main() {
  if (
    process.env.GITHUB_ACTIONS !== 'true' ||
    process.env.GITHUB_REF !== 'refs/heads/main'
  ) {
    throw new Error('This release helper must run in GitHub Actions on main');
  }
  const cwd = resolve(__dirname, '..');
  const runId = process.env.GITHUB_RUN_ID;
  if (process.argv[2] === 'prepare') {
    const result = await prepare({
      cwd,
      runId,
      releaseType: process.env.RELEASE_TYPE,
    });
    for (const [key, value] of Object.entries(result)) {
      appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
    }
    console.log(
      result.published
        ? `Version ${result.version} was already published by this run; nothing to publish.`
        : `Prepared ${result.retry ? 'existing' : 'new'} release ${
            result.version
          }.`,
    );
  } else if (process.argv[2] === 'commit') {
    const sha = commit({
      cwd,
      runId,
      version: process.env.RELEASE_VERSION,
      retry: process.env.RELEASE_RETRY === 'true',
    });
    console.log(`Release source saved on main: ${sha}`);
  } else {
    throw new Error('Expected prepare or commit');
  }
}

module.exports = { prepare, commit, isPublished };
if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
