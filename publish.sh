set -e
yarn bump
yarn build
cp package.json ./dist/src
cd ./dist/src
npm publish