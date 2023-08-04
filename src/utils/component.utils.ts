import { AllowlistState } from '../allowlist/state-types/allowlist-state';
import { CardStatistics } from '../app-types';
import { getOwnersByCardStatistics } from './app.utils';
import { getTokenPoolContractOrIdIfCustom } from './pool.utils';

export const getWalletsByComponent = ({
  state,
  phaseId,
  componentId,
  weightType,
}: {
  state: AllowlistState;
  phaseId: string;
  componentId: string;
  weightType: CardStatistics | null;
}): string[] => {
  const cards = Object.values(
    state.phases[phaseId].components[componentId].items,
  ).flatMap((item) => {
    const poolIdentifier = getTokenPoolContractOrIdIfCustom({
      poolId: item.poolId,
      poolType: item.poolType,
      state,
    });
    return item.tokens.flatMap((token) => ({
      id: `${poolIdentifier}:${token.id}`,
      owner: token.owner,
    }));
  });

  return getOwnersByCardStatistics({
    cards,
    type: weightType,
  });
};
