import { DescribableEntity } from 'src/allowlist/state-types/describable-entity';
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
