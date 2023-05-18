import { DescribableEntity } from '../allowlist/state-types/describable-entity';
import { validateNewDescribableEntity } from './validators';

describe('Validators', () => {
  let params: DescribableEntity;
  const code: any = 'code';
  const _uniqueIds: any = new Set();
  beforeEach(() => {
    params = {
      id: 'id',
      name: 'name',
      description: 'description',
    };
  });

  it('should throw an error if id is not a string', () => {
    expect(() =>
      validateNewDescribableEntity({
        params: {
          ...params,
          id: 1 as any,
        },
        code,
        _uniqueIds,
      }),
    ).toThrow('code: id must be a non-empty string, id: 1');
  });

  it('should throw an error if id is empty', () => {
    expect(() =>
      validateNewDescribableEntity({
        params: {
          ...params,
          id: '',
        },
        code,
        _uniqueIds,
      }),
    ).toThrow('code: id must be a non-empty string, id: ');
  });

  it('should throw an error if id contains spaces', () => {
    expect(() =>
      validateNewDescribableEntity({
        params: {
          ...params,
          id: 'id id',
        },
        code,
        _uniqueIds,
      }),
    ).toThrow('code: id must not contain spaces, id: id id');
  });

  it('should throw an error if id is longer than 255 characters', () => {
    expect(() =>
      validateNewDescribableEntity({
        params: {
          ...params,
          id: 'a'.repeat(256),
        },
        code,
        _uniqueIds,
      }),
    ).toThrow(
      'code: id must not be longer than 255 characters, id: ' + 'a'.repeat(256),
    );
  });

  it('should throw an error if id contains uppercase letters', () => {
    expect(() =>
      validateNewDescribableEntity({
        params: {
          ...params,
          id: 'ID',
        },
        code,
        _uniqueIds,
      }),
    ).toThrow(
      'code: id must only contain lowercase letters, numbers, underscores and dashes, id: ID',
    );
  });

  it('should throw an error if id contains special characters', () => {
    expect(() =>
      validateNewDescribableEntity({
        params: {
          ...params,
          id: 'id@',
        },
        code,
        _uniqueIds,
      }),
    ).toThrow(
      'code: id must only contain lowercase letters, numbers, underscores and dashes, id: id@',
    );
  });

  it('should throw an error if name is not a string', () => {
    expect(() =>
      validateNewDescribableEntity({
        params: {
          ...params,
          name: 1 as any,
        },
        code,
        _uniqueIds,
      }),
    ).toThrow('code: name must be a non-empty string, id: id');
  });

  it('should throw an error if name is empty', () => {
    expect(() =>
      validateNewDescribableEntity({
        params: {
          ...params,
          name: '',
        },
        code,
        _uniqueIds,
      }),
    ).toThrow('code: name must be a non-empty string, id: id');
  });

  it('should throw an error if description is not a string', () => {
    expect(() =>
      validateNewDescribableEntity({
        params: {
          ...params,
          description: 1 as any,
        },
        code,
        _uniqueIds,
      }),
    ).toThrow('code: description must be a non-empty string, id: id');
  });

  it('should throw an error if description is empty', () => {
    expect(() =>
      validateNewDescribableEntity({
        params: {
          ...params,
          description: '',
        },
        code,
        _uniqueIds,
      }),
    ).toThrow('code: description must be a non-empty string, id: id');
  });
});
