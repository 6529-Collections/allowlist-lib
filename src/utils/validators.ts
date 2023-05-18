import { DescribableEntity } from '../allowlist/state-types/describable-entity';
import { BadInputError } from '../allowlist/bad-input.error';
import { AllowlistOperationCode } from '../allowlist/allowlist-operation-code';

export function isNonEmptyString(value: any): boolean {
  return typeof value === 'string' && !!value?.length;
}

export const isNotTooLongString = (value: string): boolean => {
  return value.length <= 255;
};

export const isSuitableForUrl = (value: string): boolean => {
  const subUrlRegex = /^[a-z0-9_-]+$/;
  return subUrlRegex.test(value);
};

export function validateNewDescribableEntity(param: {
  params: DescribableEntity;
  code: AllowlistOperationCode;
  _uniqueIds: Set<string>;
}) {
  const { params, _uniqueIds, code } = param;
  const { id, name, description } = params;
  if (!isNonEmptyString(id)) {
    throw new BadInputError(
      `${code}: id must be a non-empty string, id: ${id}`,
    );
  }

  if (id.includes(' ')) {
    throw new BadInputError(`${code}: id must not contain spaces, id: ${id}`);
  }

  if (!isNotTooLongString(id)) {
    throw new BadInputError(
      `${code}: id must not be longer than 255 characters, id: ${id}`,
    );
  }

  if (!isSuitableForUrl(id)) {
    throw new BadInputError(
      `${code}: id must only contain lowercase letters, numbers, underscores and dashes, id: ${id}`,
    );
  }

  if (!isNonEmptyString(name)) {
    throw new BadInputError(
      `${code}: name must be a non-empty string, id: ${id}`,
    );
  }
  if (!isNonEmptyString(description)) {
    throw new BadInputError(
      `${code}: description must be a non-empty string, id: ${id}`,
    );
  }
  if (_uniqueIds.has(id)) {
    throw new BadInputError(`${code}: id ${id} already exists, id: ${id}`);
  }
  _uniqueIds.add(id);
}

export function isEthereumAddress(value: string): boolean {
  return value && /^0x[a-fA-F0-9]{40}$/.test(value);
}
