const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { test } = require('node:test');
const { prepare, commit, isPublished } = require('./ci-release.cjs');

function git(cwd, ...args) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function identity(cwd) {
  git(cwd, 'config', 'user.name', 'Release test');
  git(cwd, 'config', 'user.email', 'release-test@example.invalid');
  git(cwd, 'config', 'commit.gpgsign', 'false');
}

function fixture(t) {
  const temp = mkdtempSync(join(tmpdir(), 'allowlist-release-test-'));
  t.after(() => rmSync(temp, { recursive: true, force: true }));
  const remote = join(temp, 'origin.git');
  const cwd = join(temp, 'checkout');
  mkdirSync(cwd);
  git(temp, 'init', '--bare', '--initial-branch=main', remote);
  git(cwd, 'init', '--initial-branch=main');
  identity(cwd);
  const pkg = { name: '@6529-collections/allowlist-lib', version: '0.0.135' };
  writeFileSync(join(cwd, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
  writeFileSync(
    join(cwd, 'package-lock.json'),
    JSON.stringify(
      {
        ...pkg,
        lockfileVersion: 3,
        requires: true,
        packages: { '': pkg },
      },
      null,
      2,
    ) + '\n',
  );
  writeFileSync(join(cwd, 'README.md'), 'Release fixture\n');
  git(cwd, 'add', '.');
  git(cwd, 'commit', '-m', 'Initial source');
  git(cwd, 'remote', 'add', 'origin', remote);
  git(cwd, 'push', '-u', 'origin', 'main');
  return {
    cwd,
    remote,
    temp,
    runId: '1234',
    releaseType: 'patch',
    lookup: async () => false,
  };
}

function remoteVersion(remote) {
  return JSON.parse(git(remote, 'show', 'main:package.json')).version;
}

for (const [releaseType, expected] of [
  ['patch', '0.0.136'],
  ['minor', '0.1.0'],
  ['major', '1.0.0'],
]) {
  test(`${releaseType} updates both version files and pushes a release commit`, async (t) => {
    const f = fixture(t);
    const result = await prepare({ ...f, releaseType });
    assert.deepEqual(result, {
      version: expected,
      retry: false,
      published: false,
    });
    const lock = JSON.parse(
      readFileSync(join(f.cwd, 'package-lock.json'), 'utf8'),
    );
    assert.equal(lock.version, expected);
    assert.equal(lock.packages[''].version, expected);
    assert.equal(
      remoteVersion(f.remote),
      '0.0.135',
      'preparation must not push',
    );
    const sha = commit({ ...f, ...result });
    assert.equal(remoteVersion(f.remote), expected);
    assert.equal(git(f.remote, 'rev-parse', 'main'), sha);
    assert.match(
      git(f.remote, 'log', '-1', '--format=%B'),
      /Npm-Release-Run: 1234/,
    );
    assert.equal(git(f.cwd, 'status', '--porcelain'), '');
  });
}

test('a retry reuses its release source even after unrelated changes to main', async (t) => {
  const f = fixture(t);
  const result = await prepare(f);
  const releaseSha = commit({ ...f, ...result });
  writeFileSync(join(f.cwd, 'README.md'), 'Later source change\n');
  git(f.cwd, 'add', 'README.md');
  git(f.cwd, 'commit', '-m', 'Unrelated change');
  git(f.cwd, 'push', 'origin', 'HEAD:main');
  const laterSha = git(f.remote, 'rev-parse', 'main');
  const retry = await prepare(f);
  assert.deepEqual(retry, {
    version: '0.0.136',
    retry: true,
    published: false,
  });
  assert.equal(git(f.cwd, 'rev-parse', 'HEAD'), releaseSha);
  assert.equal(commit({ ...f, ...retry }), releaseSha);
  assert.equal(
    git(f.remote, 'rev-parse', 'main'),
    laterSha,
    'retry must not rewrite main',
  );
  const completed = await prepare({ ...f, lookup: async () => true });
  assert.equal(
    completed.published,
    true,
    'a completed release is a no-op on retry',
  );
});

test('a fresh workflow run increments again and supersedes an unpublished older run', async (t) => {
  const f = fixture(t);
  commit({ ...f, ...(await prepare(f)) });
  const next = { ...f, runId: '5678' };
  const result = await prepare(next);
  assert.equal(result.version, '0.0.137');
  commit({ ...next, ...result });
  await assert.rejects(prepare(f), /superseded by 0\.0\.137/);
  assert.equal(remoteVersion(f.remote), '0.0.137');
});

test('a concurrent push to main prevents the release push without losing changes', async (t) => {
  const f = fixture(t);
  const result = await prepare(f);
  const other = join(f.temp, 'other');
  git(f.temp, 'clone', f.remote, other);
  identity(other);
  writeFileSync(join(other, 'README.md'), 'Concurrent source change\n');
  git(other, 'add', 'README.md');
  git(other, 'commit', '-m', 'Concurrent change');
  git(other, 'push', 'origin', 'main');
  const otherSha = git(f.remote, 'rev-parse', 'main');
  assert.throws(
    () => commit({ ...f, ...result }),
    /rejected|fetch first|non-fast-forward/,
  );
  assert.equal(git(f.remote, 'rev-parse', 'main'), otherSha);
  assert.equal(remoteVersion(f.remote), '0.0.135');
});

test('a retry stops if a newer version is committed during validation', async (t) => {
  const f = fixture(t);
  commit({ ...f, ...(await prepare(f)) });
  const retry = await prepare(f);
  const other = join(f.temp, 'other');
  git(f.temp, 'clone', f.remote, other);
  identity(other);
  const next = { ...f, cwd: other, runId: '5678' };
  commit({ ...next, ...(await prepare(next)) });
  assert.throws(() => commit({ ...f, ...retry }), /superseded by 0\.0\.137/);
  assert.equal(remoteVersion(f.remote), '0.0.137');
});

test('unexpected changes from validation prevent a release commit', async (t) => {
  const f = fixture(t);
  const result = await prepare(f);
  writeFileSync(join(f.cwd, 'README.md'), 'Unexpected test change\n');
  assert.throws(
    () => commit({ ...f, ...result }),
    /other than the version files/,
  );
  assert.equal(remoteVersion(f.remote), '0.0.135');
});

test('a new run cannot silently switch to source added after it was requested', async (t) => {
  const f = fixture(t);
  const requestedSha = git(f.cwd, 'rev-parse', 'HEAD');
  writeFileSync(join(f.cwd, 'README.md'), 'Newer source\n');
  git(f.cwd, 'add', 'README.md');
  git(f.cwd, 'commit', '-m', 'Newer source');
  git(f.cwd, 'push', 'origin', 'HEAD:main');
  git(f.cwd, 'checkout', '--detach', requestedSha);
  await assert.rejects(prepare(f), /main advanced/);
  assert.equal(git(f.cwd, 'rev-parse', 'HEAD'), requestedSha);
  assert.equal(remoteVersion(f.remote), '0.0.135');
});

test('an existing npm version cannot be claimed by a new run', async (t) => {
  const f = fixture(t);
  await assert.rejects(
    prepare({ ...f, lookup: async () => true }),
    /already published/,
  );
  assert.equal(remoteVersion(f.remote), '0.0.135');
});

test('registry failures stop preparation before any push', async (t) => {
  const f = fixture(t);
  await assert.rejects(
    prepare({
      ...f,
      lookup: async () => {
        throw new Error('Registry unavailable');
      },
    }),
    /Registry unavailable/,
  );
  assert.equal(remoteVersion(f.remote), '0.0.135');
});

test('invalid choices and missing run IDs are rejected before changing the source', async (t) => {
  const f = fixture(t);
  await assert.rejects(
    prepare({ ...f, releaseType: 'patch; echo unsafe' }),
    /must be patch/,
  );
  await assert.rejects(prepare({ ...f, runId: '' }), /run ID/);
  assert.equal(git(f.cwd, 'status', '--porcelain'), '');
});

test('retry commits require a matching run marker', (t) => {
  const f = fixture(t);
  assert.throws(
    () => commit({ ...f, version: '0.0.135', retry: true }),
    /does not match/,
  );
});

test('registry lookup distinguishes absence, success, and service errors', async (t) => {
  const response = t.mock.method(globalThis, 'fetch');
  response.mock.mockImplementation(
    async () => new Response('{}', { status: 404 }),
  );
  assert.equal(await isPublished('example', '1.0.0'), false);
  response.mock.mockImplementation(
    async () =>
      new Response(JSON.stringify({ name: 'example', version: '1.0.0' })),
  );
  assert.equal(await isPublished('example', '1.0.0'), true);
  response.mock.mockImplementation(
    async () => new Response('{}', { status: 503 }),
  );
  await assert.rejects(isPublished('example', '1.0.0'), /HTTP 503/);
  response.mock.mockImplementation(async () => new Response('{}'));
  await assert.rejects(
    isPublished('example', '1.0.0'),
    /unexpected package metadata/,
  );
});
