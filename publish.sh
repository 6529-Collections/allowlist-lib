#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
npm run audit
npm test -- --runInBand
npm run test:package
npm publish "$@"
