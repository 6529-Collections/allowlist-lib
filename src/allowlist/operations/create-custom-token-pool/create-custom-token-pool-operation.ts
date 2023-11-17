import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { AllowlistState } from '../../state-types/allowlist-state';

import { BadInputError } from '../../bad-input.error';
import { isEthereumAddress } from '../../../utils/validators';
import { CustomTokenPoolParams } from './create-custom-token-pool-operation.types';

export class CreateCustomTokenPoolOperation
  implements AllowlistOperationExecutor
{
  validate(params: any): params is CustomTokenPoolParams {
    this.assertIdValid(params);
    this.assertNameValid(params);
    this.assertDescriptionValid(params);
    this.assertTokenBaseValid(params);

    for (const token of params.tokens) {
      this.assertTokenIdValid(token);
      this.assertTokenOwnersValid(token);
    }
    return true;
  }

  private assertTokenOwnersValid(token) {
    if (!token.hasOwnProperty('owner')) {
      throw new BadInputError('Invalid tokens');
    }

    if (typeof token.owner !== 'string') {
      throw new BadInputError('Invalid tokens');
    }

    if (!token.owner.length) {
      throw new BadInputError('Invalid tokens');
    }

    if (!isEthereumAddress(token.owner)) {
      throw new BadInputError('Invalid tokens');
    }
  }

  private assertTokenIdValid(token) {
    if (token.hasOwnProperty('id')) {
      if (typeof token.id !== 'string') {
        throw new BadInputError('Invalid tokens');
      }

      if (!token.id.length) {
        throw new BadInputError('Invalid tokens');
      }
    }
  }

  private assertTokenBaseValid(params: any) {
    if (!params.hasOwnProperty('tokens')) {
      throw new BadInputError('Missing tokens');
    }

    if (!Array.isArray(params.tokens)) {
      throw new BadInputError('Invalid tokens');
    }

    if (!params.tokens.length) {
      throw new BadInputError('Invalid tokens');
    }

    if (!params.tokens.every((token) => typeof token === 'object')) {
      throw new BadInputError('Invalid tokens');
    }

    const haveTokenId = params.tokens.some((token) => token.id);
    const haveNotTokenId = params.tokens.some((token) => !token.id);

    if (haveTokenId && haveNotTokenId) {
      throw new BadInputError('Invalid tokens');
    }
  }

  private assertDescriptionValid(params: any) {
    if (!params.hasOwnProperty('description')) {
      throw new BadInputError('Missing description');
    }

    if (typeof params.description !== 'string') {
      throw new BadInputError('Invalid description');
    }

    if (!params.description.length) {
      throw new BadInputError('Invalid description');
    }
  }

  private assertNameValid(params: any) {
    if (!params.hasOwnProperty('name')) {
      throw new BadInputError('Missing name');
    }

    if (typeof params.name !== 'string') {
      throw new BadInputError('Invalid name');
    }

    if (!params.name.length) {
      throw new BadInputError('Invalid name');
    }
  }

  private assertIdValid(params: any) {
    if (!params.hasOwnProperty('id')) {
      throw new BadInputError('Missing id');
    }

    if (typeof params.id !== 'string') {
      throw new BadInputError('Invalid id');
    }

    if (!params.id.length) {
      throw new BadInputError('Invalid id');
    }
  }

  execute({
    params,
    state,
  }: {
    params: CustomTokenPoolParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { id, name, description, tokens } = params;
    state.customTokenPools[id] = {
      id,
      name,
      description,
      tokens: tokens.map((token, i) => ({
        id: token.id ?? (i + 1).toString(),
        owner: token.owner,
      })),
    };
  }
}
