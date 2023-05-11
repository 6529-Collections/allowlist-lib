import { AllowlistOperationCode } from './allowlist-operation-code';

export interface AllowlistOperation {
  readonly code: AllowlistOperationCode;
  readonly params: any;
}
