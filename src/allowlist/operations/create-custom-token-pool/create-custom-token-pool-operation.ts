import { AllowlistOperationExecutor } from '../../../allowlist/allowlist-operation-executor';
import { AllowlistState } from '../../..//allowlist/state-types/allowlist-state';

import { BadInputError } from '../../..//allowlist/bad-input.error';
import { isEthereumAddress } from '../../../utils/validators';
import { CustomTokenPoolParams } from './create-custom-token-pool-operation.types';

export class CreateCustomTokenPoolOperation
  implements AllowlistOperationExecutor
{
  execute({
    params,
    state,
  }: {
    params: CustomTokenPoolParams;
    state: AllowlistState;
  }) {
    const { id, name, description, tokens } = params;

    if (!Array.isArray(tokens)) {
      throw new BadInputError(
        `CREATE_CUSTOM_TOKEN_POOL: Custom token pool tokens must be an array, poolId: ${id}`,
      );
    }

    if (!tokens.length) {
      throw new BadInputError(
        `CREATE_CUSTOM_TOKEN_POOL: Custom token pool tokens must be a non-empty array, poolId: ${id}`,
      );
    }

    const isObjectsArray = tokens.every((token) => typeof token === 'object');
    if (!isObjectsArray) {
      throw new BadInputError(
        `CREATE_CUSTOM_TOKEN_POOL: Custom token pool tokens must be an array of objects, poolId: ${id}`,
      );
    }

    const haveTokenId = tokens.some((token) => token.id);
    const haveNotTokenId = tokens.some((token) => !token.id);

    if (haveTokenId && haveNotTokenId) {
      throw new BadInputError(
        `CREATE_CUSTOM_TOKEN_POOL: All tokens must have id or none of them, poolId: ${id}`,
      );
    }

    const haveTokenSince = tokens.some((token) => token.since);
    const haveNotTokenSince = tokens.some((token) => !token.since);

    if (haveTokenSince && haveNotTokenSince) {
      throw new BadInputError(
        `CREATE_CUSTOM_TOKEN_POOL: All tokens must have since or none of them, poolId: ${id}`,
      );
    }

    for (const token of tokens) {
      if (token.id && typeof token.id !== 'string') {
        throw new BadInputError(
          `CREATE_CUSTOM_TOKEN_POOL: Token id must be a string, poolId: ${id}`,
        );
      }

      if (typeof token.owner !== 'string') {
        throw new BadInputError(
          `CREATE_CUSTOM_TOKEN_POOL: Token owner must be a string, poolId: ${id}`,
        );
      }

      if (!isEthereumAddress(token.owner)) {
        throw new BadInputError(
          `CREATE_CUSTOM_TOKEN_POOL: Token owner ${token.owner} is not a valid Ethereum address, poolId: ${id}`,
        );
      }

      if (token.since && typeof token.since !== 'number') {
        throw new BadInputError(
          `CREATE_CUSTOM_TOKEN_POOL: Token since must be a number, poolId: ${id}`,
        );
      }
    }

    state.customTokenPools[id] = {
      id,
      name,
      description,
      tokens: tokens.map((token, i) => ({
        id: token.id ?? (i + 1).toString(),
        owner: token.owner,
        since: token.since ?? new Date().getTime(),
      })),
    };
  }
}
