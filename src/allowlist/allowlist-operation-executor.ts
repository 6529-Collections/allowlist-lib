import { AllowlistState } from './state-types/allowlist-state';

export interface AllowlistOperationExecutor {
  validate(params: any): params is any;
  execute({ params, state }: { params: any; state: AllowlistState });
}
