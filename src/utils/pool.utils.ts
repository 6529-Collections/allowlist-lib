import { BadInputError } from '../allowlist/bad-input.error';
import { AllowlistState } from '../allowlist/state-types/allowlist-state';
import { Pool } from '../app-types';

export const getTokenPoolContractOrIdIfCustom = ({
  poolId,
  poolType,
  state,
}: {
  readonly poolId: string;
  readonly poolType: Pool;
  readonly state: AllowlistState;
}): string => {
  switch (poolType) {
    case Pool.TOKEN_POOL:
      const tokenPool = state.tokenPools[poolId];
      if (!tokenPool) {
        throw new BadInputError(`Invalid pool id: ${poolId}`);
      }
      const contract = tokenPool.tokens.at(0)?.contract;
      if (!contract) {
        throw new BadInputError(`Invalid pool id: ${poolId}`);
      }
      return contract;
    case Pool.CUSTOM_TOKEN_POOL:
      const customTokenPool = state.customTokenPools[poolId];
      if (!customTokenPool) {
        throw new BadInputError(`Invalid pool id: ${poolId}`);
      }
      return poolId;
    case Pool.WALLET_POOL:
      const walletPool = state.walletPools[poolId];
      if (!walletPool) {
        throw new BadInputError(`Invalid pool id: ${poolId}`);
      }
      return poolId;
    default:
      throw new Error(`Invalid pool type: ${poolType}`);
  }
};
