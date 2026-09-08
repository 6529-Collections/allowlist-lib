const {
  AllowlistCreator,
  AllowlistOperationCode,
} = require('@6529-collections/allowlist-lib');

async function main() {
  const creator = AllowlistCreator.getInstance({
    // This example makes no API requests. Supply real keys for operations
    // that fetch blockchain data; the factory still requires an Alchemy key.
    alchemyApiKey: process.env.ALCHEMY_API_KEY || 'offline-example',
    etherscanApiKey: process.env.ETHERSCAN_API_KEY || '',
    seizeApiPath: '',
  });

  const state = await creator.execute([
    {
      code: AllowlistOperationCode.CREATE_ALLOWLIST,
      params: {
        id: 'example-allowlist',
        name: 'Example allowlist',
        description: 'An empty distribution plan ready for more operations.',
      },
    },
  ]);
  console.log(state.allowlist);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
