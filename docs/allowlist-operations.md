# Allowlist Operations

###### CREATE_ALLOWLIST

The `CREATE_ALLOWLIST` operation the `create_allowlist` operation serves as the foundational stone for curating allowlists within the janus nft distribution system. similar to the main function in numerous programming languages, this operation not only kickstarts the allowlist creation but also ensures that a structured, identifiable, and descriptive scaffold is in place for subsequent operations.

###### Parameters

- **id (String)**:
  - **Description**: Parameter "id" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **name (String)**:
  - **Description**: Parameter "name" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **description (String)**:
  - **Description**: Parameter "description" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

###### GET_COLLECTION_TRANSFERS

The `GET_COLLECTION_TRANSFERS` operation no description found.

###### Parameters

- **id (String)**:
  - **Description**: Parameter "id" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **contract (String)**:
  - **Description**: Parameter "contract" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.
    - Must satisfy the "isEthereumAddress" condition.

- **blockNo (Number)**:
  - **Description**: Parameter "blockNo" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "Number".
    - Must satisfy the "Number.isInteger" condition.

- **undefined (undefined)**:
  - **Description**: Parameter "undefined"
  - **Requirements**:

###### CREATE_TOKEN_POOL

The `CREATE_TOKEN_POOL` operation no description found.

###### Parameters

- **id (String)**:
  - **Description**: Parameter "id" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **contract (String)**:
  - **Description**: Parameter "contract" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.
    - Must be provided.

- **undefined (undefined)**:
  - **Description**: Parameter "undefined"
  - **Requirements**:

- **blockNo (Number)**:
  - **Description**: Parameter "blockNo"
  - **Requirements**:
    - Must be of type "Number".
    - Must be non-negative.
    - Must be an integer.

- **consolidateBlockNo (undefined)**:
  - **Description**: Parameter "consolidateBlockNo" is required.
  - **Requirements**:
    - Must be provided.
    - Must be non-negative.
    - Must be an integer.

###### CREATE_CUSTOM_TOKEN_POOL

The `CREATE_CUSTOM_TOKEN_POOL` operation no description found.

###### Parameters

- **id (String)**:
  - **Description**: Parameter "id" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.
    - Must be provided.

- **name (String)**:
  - **Description**: Parameter "name" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **description (String)**:
  - **Description**: Parameter "description" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **tokens (undefined)**:
  - **Description**: Parameter "tokens" is required.
  - **Requirements**:
    - Must be provided.
    - Must satisfy the "Array.isArray" condition.
    - Must not be empty.

- **undefined (undefined)**:
  - **Description**: Parameter "undefined"
  - **Requirements**:

- **owner (undefined)**:
  - **Description**: Parameter "owner" is required.
  - **Requirements**:
    - Must be provided.

###### CREATE_WALLET_POOL

The `CREATE_WALLET_POOL` operation no description found.

###### Parameters

- **id (String)**:
  - **Description**: Parameter "id" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **name (String)**:
  - **Description**: Parameter "name" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **description (String)**:
  - **Description**: Parameter "description" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **wallets (undefined)**:
  - **Description**: Parameter "wallets" is required.
  - **Requirements**:
    - Must be provided.
    - Must satisfy the "Array.isArray" condition.
    - Must not be empty.

- **undefined (undefined)**:
  - **Description**: Parameter "undefined"
  - **Requirements**:

###### ADD_PHASE

The `ADD_PHASE` operation no description found.

###### Parameters

- **id (String)**:
  - **Description**: Parameter "id" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **name (String)**:
  - **Description**: Parameter "name" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **description (String)**:
  - **Description**: Parameter "description" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

###### ADD_COMPONENT

The `ADD_COMPONENT` operation no description found.

###### Parameters

- **phaseId (String)**:
  - **Description**: Parameter "phaseId" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **id (String)**:
  - **Description**: Parameter "id" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **name (String)**:
  - **Description**: Parameter "name" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **description (String)**:
  - **Description**: Parameter "description" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

###### COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS

The `COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS` operation no description found.

###### Parameters

- **componentId (String)**:
  - **Description**: Parameter "componentId" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **spots (Number)**:
  - **Description**: Parameter "spots" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "Number".
    - Must satisfy the "Number.isInteger" condition.

- **undefined (undefined)**:
  - **Description**: Parameter "undefined"
  - **Requirements**:

###### COMPONENT_SELECT_RANDOM_WALLETS

The `COMPONENT_SELECT_RANDOM_WALLETS` operation no description found.

###### Parameters

- **componentId (String)**:
  - **Description**: Parameter "componentId" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **count (Number)**:
  - **Description**: Parameter "count" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "Number".
    - Must satisfy the "Number.isInteger" condition.

- **undefined (undefined)**:
  - **Description**: Parameter "undefined"
  - **Requirements**:

- **seed (String)**:
  - **Description**: Parameter "seed" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **weightType (String)**:
  - **Description**: Parameter "weightType" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.
    - Must satisfy the "Object.values(CardStatistics).includes" condition.

###### ADD_ITEM

The `ADD_ITEM` operation no description found.

###### Parameters

- **componentId (String)**:
  - **Description**: Parameter "componentId" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **id (String)**:
  - **Description**: Parameter "id" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **name (String)**:
  - **Description**: Parameter "name" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **description (String)**:
  - **Description**: Parameter "description" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **poolId (String)**:
  - **Description**: Parameter "poolId" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **poolType (String)**:
  - **Description**: Parameter "poolType" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".

- **undefined (undefined)**:
  - **Description**: Parameter "undefined"
  - **Requirements**:

###### ITEM_SELECT_TOKEN_IDS

The `ITEM_SELECT_TOKEN_IDS` operation no description found.

###### Parameters

- **itemId (String)**:
  - **Description**: Parameter "itemId" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **tokenIds (String)**:
  - **Description**: Parameter "tokenIds" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.
    - Must satisfy the "isValidTokenIds" condition.

###### ITEM_REMOVE_FIRST_N_TOKENS

The `ITEM_REMOVE_FIRST_N_TOKENS` operation no description found.

###### Parameters

- **itemId (String)**:
  - **Description**: Parameter "itemId" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **count (Number)**:
  - **Description**: Parameter "count" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "Number".
    - Must be non-negative.

###### ITEM_REMOVE_LAST_N_TOKENS

The `ITEM_REMOVE_LAST_N_TOKENS` operation no description found.

###### Parameters

- **itemId (String)**:
  - **Description**: Parameter "itemId" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **count (Number)**:
  - **Description**: Parameter "count" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "Number".
    - Must be non-negative.

###### ITEM_SELECT_FIRST_N_TOKENS

The `ITEM_SELECT_FIRST_N_TOKENS` operation no description found.

###### Parameters

- **itemId (String)**:
  - **Description**: Parameter "itemId" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **count (Number)**:
  - **Description**: Parameter "count" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "Number".
    - Must be non-negative.

###### ITEM_SELECT_LAST_N_TOKENS

The `ITEM_SELECT_LAST_N_TOKENS` operation no description found.

###### Parameters

- **itemId (String)**:
  - **Description**: Parameter "itemId" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **count (Number)**:
  - **Description**: Parameter "count" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "Number".
    - Must be non-negative.

###### ITEM_SORT_WALLETS_BY_TOTAL_TOKENS_COUNT

The `ITEM_SORT_WALLETS_BY_TOTAL_TOKENS_COUNT` operation no description found.

###### Parameters

- **itemId (String)**:
  - **Description**: Parameter "itemId" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

###### ITEM_SORT_WALLETS_BY_UNIQUE_TOKENS_COUNT

The `ITEM_SORT_WALLETS_BY_UNIQUE_TOKENS_COUNT` operation no description found.

###### Parameters

- **itemId (String)**:
  - **Description**: Parameter "itemId" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

###### ITEM_REMOVE_FIRST_N_WALLETS

The `ITEM_REMOVE_FIRST_N_WALLETS` operation no description found.

###### Parameters

- **itemId (String)**:
  - **Description**: Parameter "itemId" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **count (Number)**:
  - **Description**: Parameter "count" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "Number".
    - Must be non-negative.

###### ITEM_SELECT_FIRST_N_WALLETS

The `ITEM_SELECT_FIRST_N_WALLETS` operation no description found.

###### Parameters

- **itemId (String)**:
  - **Description**: Parameter "itemId" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **count (Number)**:
  - **Description**: Parameter "count" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "Number".
    - Must be non-negative.

###### ITEM_SORT_WALLETS_BY_MEMES_TDH

The `ITEM_SORT_WALLETS_BY_MEMES_TDH` operation no description found.

###### Parameters

- **itemId (String)**:
  - **Description**: Parameter "itemId" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **tdhBlockNumber (Number)**:
  - **Description**: Parameter "tdhBlockNumber" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "Number".
    - Must be non-negative.
    - Must be an integer.

###### TRANSFER_POOL_CONSOLIDATE_WALLETS

The `TRANSFER_POOL_CONSOLIDATE_WALLETS` operation no description found.

###### Parameters

- **transferPoolId (String)**:
  - **Description**: Parameter "transferPoolId" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **consolidationBlockNumber (Number)**:
  - **Description**: Parameter "consolidationBlockNumber" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "Number".
    - Must be non-negative.
    - Must be an integer.

###### TOKEN_POOL_CONSOLIDATE_WALLETS

The `TOKEN_POOL_CONSOLIDATE_WALLETS` operation no description found.

###### Parameters

- **tokenPoolId (String)**:
  - **Description**: Parameter "tokenPoolId" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.

- **consolidationBlockNumber (Number)**:
  - **Description**: Parameter "consolidationBlockNumber" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "Number".
    - Must be non-negative.
    - Must be an integer.

###### MAP_RESULTS_TO_DELEGATED_WALLETS

The `MAP_RESULTS_TO_DELEGATED_WALLETS` operation no description found.

###### Parameters

- **delegationContract (String)**:
  - **Description**: Parameter "delegationContract" is required.
  - **Requirements**:
    - Must be provided.
    - Must be of type "String".
    - Must not be empty.
    - Must satisfy the "isEthereumAddress" condition.

