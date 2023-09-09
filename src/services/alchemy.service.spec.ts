import { AlchemyService } from './alchemy.service';
import { Alchemy, Network } from 'alchemy-sdk';
import { EtherscanService } from './etherscan.service';
import { defaultLogFactory } from '../logging/logging-emitter';
import { DelegationService } from './delegation/delegation.service';
import { SeizeApi } from './seize/seize.api';
import { Http } from './http';

jest.setTimeout(10000000);

describe('AlchemyService', () => {
  it('should ', async () => {
    const alchemy = new Alchemy({
      apiKey: 'FKY6b7pRiJA70V8TFUCQAzxHVQ3tlwtm',
      network: Network.ETH_MAINNET,
    });
    const alchemyService = new AlchemyService(alchemy);
    const eth = new EtherscanService(
      { apiKey: '7SV3ABIQ51AWIPAE1PKCUSM4D7PRCVAAUP' },
      defaultLogFactory,
    );
    const toBlock = await alchemy.core.getBlockNumber();
    const delegationService = new DelegationService(eth, alchemyService);
    const delegationsState =
      await delegationService.getDelegationsStateForBlock(toBlock);
    console.log(
      `Finished processing ${delegationsState.activeDelegations.length} delegations`,
    );
  });
});
