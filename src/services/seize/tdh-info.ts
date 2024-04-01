
export interface CommonTdhInfo {
  readonly consolidation_key: string;
  readonly consolidation_display: string;
  readonly block: number;
  readonly date: string;
  readonly total_balance: number;
  readonly boosted_tdh: number;
  readonly tdh_rank: number;
  readonly tdh: number;
  readonly tdh__raw: number;
  readonly boost: number;
  readonly memes_balance: number;
  readonly unique_memes: number;
  readonly memes_cards_sets: number;
  readonly memes_cards_sets_minus1: number;
  readonly memes_cards_sets_minus2: number;
  readonly genesis: number;
  readonly nakamoto: number;
  readonly boosted_memes_tdh: number;
  readonly memes_tdh: number;
  readonly memes_tdh__raw: number;
  readonly tdh_rank_memes: number;
  readonly memes: {
    readonly id: number;
    readonly tdh: number;
    readonly balance: number;
    readonly tdh__raw: number;
    readonly rank: number;
  }[];
  readonly gradients_balance: number;
  readonly boosted_gradients_tdh: number;
  readonly gradients_tdh: number;
  readonly gradients_tdh__raw: number;
  readonly tdh_rank_gradients: number;
  readonly gradients: {
    readonly id: number;
    readonly tdh: number;
    readonly balance: number;
    readonly tdh__raw: number;
    readonly rank: number;
  }[];

  readonly nextgen_balance: number;
  readonly boosted_nextgen_tdh: number;
  readonly nextgen_tdh: number;
  readonly nextgen_tdh__raw: number;
  readonly nextgen: {
    readonly id: number;
    readonly tdh: number;
    readonly balance: number;
    readonly tdh__raw: number;
    readonly rank: number;
  }[];
}

export interface TdhInfo extends CommonTdhInfo {
  readonly ens?: string;
  readonly wallet: string;
}

export interface ConsolidatedTdhInfo extends CommonTdhInfo {
  readonly consolidation_display: string;
  readonly wallets: string[];
}
