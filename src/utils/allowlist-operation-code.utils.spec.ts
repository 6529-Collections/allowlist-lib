import {
  AllowlistOperationCode,
  AllowlistOperationType,
} from '../allowlist/allowlist-operation-code';
import { getCodesForType } from './allowlist-operation-code.utils';

describe('AllowlistOperationCodeUtils', () => {
  let opertatinTypesToCheck = Object.values(AllowlistOperationType);
  it('should throw and error if the type is invalid', () => {
    expect(() => getCodesForType('invalid' as AllowlistOperationType)).toThrow(
      'Invalid AllowlistOperationType: invalid',
    );
  });

  it('should return correct codes for OVERALL', () => {
    expect(getCodesForType(AllowlistOperationType.OVERALL)).toEqual([
      AllowlistOperationCode.CREATE_ALLOWLIST,
    ]);
    opertatinTypesToCheck = opertatinTypesToCheck.filter(
      (t) => t !== AllowlistOperationType.OVERALL,
    );
  });

  it('should return correct codes for TRANSFER_POOLS', () => {
    expect(getCodesForType(AllowlistOperationType.TRANSFER_POOLS)).toEqual([
      AllowlistOperationCode.GET_COLLECTION_TRANSFERS,
    ]);
    opertatinTypesToCheck = opertatinTypesToCheck.filter(
      (t) => t !== AllowlistOperationType.TRANSFER_POOLS,
    );
  });

  it('should return correct codes for TRANSFER_POOL', () => {
    expect(getCodesForType(AllowlistOperationType.TRANSFER_POOL)).toEqual([]);
    opertatinTypesToCheck = opertatinTypesToCheck.filter(
      (t) => t !== AllowlistOperationType.TRANSFER_POOL,
    );
  });

  it('should return correct codes for TOKEN_POOLS', () => {
    expect(getCodesForType(AllowlistOperationType.TOKEN_POOLS)).toEqual([
      AllowlistOperationCode.CREATE_TOKEN_POOL,
    ]);
    opertatinTypesToCheck = opertatinTypesToCheck.filter(
      (t) => t !== AllowlistOperationType.TOKEN_POOLS,
    );
  });

  it('should return correct codes for TOKEN_POOL', () => {
    expect(getCodesForType(AllowlistOperationType.TOKEN_POOL)).toEqual([]);
    opertatinTypesToCheck = opertatinTypesToCheck.filter(
      (t) => t !== AllowlistOperationType.TOKEN_POOL,
    );
  });

  it('should return correct codes for CUSTOM_POOLS', () => {
    expect(getCodesForType(AllowlistOperationType.CUSTOM_POOLS)).toEqual([
      AllowlistOperationCode.CREATE_CUSTOM_TOKEN_POOL,
    ]);

    opertatinTypesToCheck = opertatinTypesToCheck.filter(
      (t) => t !== AllowlistOperationType.CUSTOM_POOLS,
    );
  });

  it('should return correct codes for CUSTOM_POOL', () => {
    expect(getCodesForType(AllowlistOperationType.CUSTOM_POOL)).toEqual([]);

    opertatinTypesToCheck = opertatinTypesToCheck.filter(
      (t) => t !== AllowlistOperationType.CUSTOM_POOL,
    );
  });

  it('should return correct codes for WALLET_POOLS', () => {
    expect(getCodesForType(AllowlistOperationType.WALLET_POOLS)).toEqual([
      AllowlistOperationCode.CREATE_WALLET_POOL,
    ]);

    opertatinTypesToCheck = opertatinTypesToCheck.filter(
      (t) => t !== AllowlistOperationType.WALLET_POOLS,
    );
  });

  it('should return correct codes for WALLET_POOL', () => {
    expect(getCodesForType(AllowlistOperationType.WALLET_POOL)).toEqual([]);

    opertatinTypesToCheck = opertatinTypesToCheck.filter(
      (t) => t !== AllowlistOperationType.WALLET_POOL,
    );
  });

  it('should return correct codes for PHASES', () => {
    expect(getCodesForType(AllowlistOperationType.PHASES)).toEqual([
      AllowlistOperationCode.ADD_PHASE,
    ]);

    opertatinTypesToCheck = opertatinTypesToCheck.filter(
      (t) => t !== AllowlistOperationType.PHASES,
    );
  });

  it('should return correct codes for PHASE', () => {
    expect(getCodesForType(AllowlistOperationType.PHASE)).toEqual([]);

    opertatinTypesToCheck = opertatinTypesToCheck.filter(
      (t) => t !== AllowlistOperationType.PHASE,
    );
  });

  it('should return correct codes for COMPONENTS', () => {
    expect(getCodesForType(AllowlistOperationType.COMPONENTS)).toEqual([
      AllowlistOperationCode.ADD_COMPONENT,
    ]);

    opertatinTypesToCheck = opertatinTypesToCheck.filter(
      (t) => t !== AllowlistOperationType.COMPONENTS,
    );
  });

  it('should return correct codes for COMPONENT', () => {
    expect(getCodesForType(AllowlistOperationType.COMPONENT)).toEqual([
      AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
      AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_WALLETS_EXCLUDING_CERTAIN_COMPONENTS,
      AllowlistOperationCode.COMPONENT_SELECT_RANDOM_WALLETS,
    ]);

    opertatinTypesToCheck = opertatinTypesToCheck.filter(
      (t) => t !== AllowlistOperationType.COMPONENT,
    );
  });

  it('should return correct codes for ITEMS', () => {
    expect(getCodesForType(AllowlistOperationType.ITEMS)).toEqual([
      AllowlistOperationCode.ADD_ITEM,
    ]);

    opertatinTypesToCheck = opertatinTypesToCheck.filter(
      (t) => t !== AllowlistOperationType.ITEMS,
    );
  });

  it('should return correct codes for ITEM', () => {
    expect(getCodesForType(AllowlistOperationType.ITEM)).toEqual([
      AllowlistOperationCode.ITEM_EXCLUE_TOKEN_IDS,
      AllowlistOperationCode.ITEM_SELECT_TOKEN_IDS,
      AllowlistOperationCode.ITEM_REMOVE_FIRST_N_TOKENS,
      AllowlistOperationCode.ITEM_REMOVE_LAST_N_TOKENS,
      AllowlistOperationCode.ITEM_SELECT_FIRST_N_TOKENS,
      AllowlistOperationCode.ITEM_SELECT_LAST_N_TOKENS,
      AllowlistOperationCode.ITEM_SORT_WALLETS_BY_TOTAL_TOKENS_COUNT,
      AllowlistOperationCode.ITEM_SORT_WALLETS_BY_UNIQUE_TOKENS_COUNT,
      AllowlistOperationCode.ITEM_REMOVE_FIRST_N_WALLETS,
      AllowlistOperationCode.ITEM_SELECT_FIRST_N_WALLETS,
      AllowlistOperationCode.ITEM_REMOVE_WALLETS_FROM_CERTAIN_COMPONENTS,
    ]);

    opertatinTypesToCheck = opertatinTypesToCheck.filter(
      (t) => t !== AllowlistOperationType.ITEM,
    );
  });

  it('should check that all types are covered, it fails if run alone, needs to run with all others', () => {
    expect(opertatinTypesToCheck).toEqual([]);
  });
});
