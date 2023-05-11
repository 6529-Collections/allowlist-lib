import { AllowlistState } from './state-types/allowlist-state';

export interface AllowlistOperationExecutor {
  execute({ params, state }: { params: any; state: AllowlistState });
}
