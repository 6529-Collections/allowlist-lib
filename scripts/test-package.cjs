const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const {
  copyFileSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} = require('node:fs');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');

const root = resolve(__dirname, '..');
const temp = mkdtempSync(join(tmpdir(), 'allowlist-lib-package-'));
const manifest = require('../package.json');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(command, args, cwd = root) {
  try {
    return execFileSync(command, args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'inherit'],
    });
  } catch (error) {
    if (error.stdout) process.stderr.write(error.stdout);
    throw error;
  }
}

try {
  // A real pack runs prepack, proving that a clean consumer gets fresh output.
  // Seed stale output to catch a build that leaves old files in the tarball.
  mkdirSync(join(root, 'dist'), { recursive: true });
  writeFileSync(
    join(root, 'dist', 'stale.spec.js'),
    'throw new Error("stale build");',
  );
  const packed = JSON.parse(
    run(npm, ['pack', '--json', '--pack-destination', temp]),
  );
  // npm 12 keys JSON results by package name; earlier releases use an array.
  const tarball = Array.isArray(packed) ? packed[0] : packed[manifest.name];
  const paths = tarball.files.map(({ path }) => path);
  for (const required of [
    'package.json',
    'README.md',
    'LICENSE',
    'dist/index.js',
    'dist/index.d.ts',
    'examples/basic.cjs',
  ]) {
    assert(paths.includes(required), `Missing published file: ${required}`);
  }
  for (const path of paths) {
    assert(
      ['package.json', 'README.md', 'LICENSE', 'examples/basic.cjs'].includes(
        path,
      ) || /^dist\/.*\.(js|d\.ts)$/.test(path),
      `Unexpected published file: ${path}`,
    );
    assert(
      !/(^|[/.])(spec|test|fixture|env)([/.]|$)/.test(path),
      `Non-runtime file: ${path}`,
    );
  }

  const consumer = join(temp, 'consumer');
  mkdirSync(consumer);
  writeFileSync(
    join(consumer, 'package.json'),
    JSON.stringify({ name: 'allowlist-package-smoke', private: true }),
  );
  run(
    npm,
    [
      'install',
      join(temp, tarball.filename),
      `@types/node@${manifest.devDependencies['@types/node']}`,
      '--ignore-scripts',
      '--package-lock=true',
      '--no-audit',
      '--no-fund',
      '--registry=https://registry.npmjs.org/',
    ],
    consumer,
  );
  // Audit the dependency tree consumers actually install, not just our lockfile.
  run(npm, ['audit', '--omit=dev', '--audit-level=low'], consumer);

  const installed = join(consumer, 'node_modules', ...manifest.name.split('/'));
  const installedManifest = JSON.parse(
    readFileSync(join(installed, 'package.json'), 'utf8'),
  );
  assert.equal(installedManifest.license, 'MIT');
  assert.equal(
    installedManifest.publishConfig.registry,
    'https://registry.npmjs.org/',
  );
  assert.equal(installedManifest.publishConfig.access, 'public');

  copyFileSync(
    join(installed, 'examples/basic.cjs'),
    join(consumer, 'basic.cjs'),
  );
  const output = run(process.execPath, ['basic.cjs'], consumer);
  assert(
    output.includes('example-allowlist'),
    'Quick start did not create an allowlist',
  );

  // Verify every legacy module path, including the nested paths used by EMMA.
  const modules = paths
    .filter((path) => path.startsWith('dist/') && path.endsWith('.js'))
    .map((path) => `${manifest.name}/${path.slice(5, -3)}`);
  run(
    process.execPath,
    [
      '-e',
      `
    const assert = require('node:assert/strict');
    const lib = require(${JSON.stringify(manifest.name)});
    assert.equal(lib.AllowlistCreator, require(${JSON.stringify(
      `${manifest.name}/allowlist/allowlist-creator`,
    )}).AllowlistCreator);
    for (const name of ${JSON.stringify(modules)}) {
      require(name);
      require(name + '.js');
    }
  `,
    ],
    consumer,
  );
  run(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
    import assert from 'node:assert/strict';
    import { AllowlistCreator, AllowlistOperationCode } from ${JSON.stringify(
      manifest.name,
    )};
    import { AllowlistCreator as LegacyCreator } from ${JSON.stringify(
      `${manifest.name}/allowlist/allowlist-creator`,
    )};
    assert.equal(AllowlistCreator, LegacyCreator);
    assert.equal(AllowlistOperationCode.CREATE_ALLOWLIST, 'CREATE_ALLOWLIST');
  `,
    ],
    consumer,
  );

  const types = `
    import { AllowlistCreator, AllowlistCreatorConfig, AllowlistOperation, AllowlistOperationCode, AllowlistState, StorageImplementations } from '${manifest.name}';
    import { AllowlistCreator as LegacyCreator } from '${manifest.name}/allowlist/allowlist-creator';
    import { LoggerFactory } from '${manifest.name}/logging/logging-emitter';
    import { Pool } from '${manifest.name}/app-types';
    const creator: typeof AllowlistCreator = LegacyCreator;
    const operation: AllowlistOperation = { code: AllowlistOperationCode.CREATE_ALLOWLIST, params: {} };
    const execute: (operations: AllowlistOperation[]) => Promise<AllowlistState> = creator.prototype.execute;
    const makeCreator: (config: AllowlistCreatorConfig) => AllowlistCreator = creator.getInstance;
    const storage: StorageImplementations | undefined = undefined;
    const logger = new LoggerFactory({ info: () => {}, error: () => {}, warn: () => {}, debug: () => {} });
    const pool: Pool = Pool.WALLET_POOL;
  `;
  // The empty legacy main module has never declared any exports.
  const declarations = modules
    .filter((name) => !name.endsWith('/main'))
    .map((name, i) => `import type * as Module${i} from '${name}';`)
    .join('\n');
  for (const [module, moduleResolution, extension] of [
    ['commonjs', 'node', 'ts'],
    ['node16', 'node16', 'mts'],
  ]) {
    const file = `consumer.${extension}`;
    writeFileSync(join(consumer, file), types + '\n' + declarations);
    run(
      process.execPath,
      [
        require.resolve('typescript/bin/tsc'),
        file,
        '--noEmit',
        '--strict',
        '--target',
        'es2020',
        '--module',
        module,
        '--moduleResolution',
        moduleResolution,
        '--esModuleInterop',
        '--skipLibCheck',
      ],
      consumer,
    );
  }
  console.log(
    `Package verified: ${paths.length} files, ${tarball.unpackedSize} unpacked bytes; CommonJS, ESM, legacy imports, TypeScript, and quick start passed.`,
  );
} finally {
  rmSync(temp, { recursive: true, force: true });
}
