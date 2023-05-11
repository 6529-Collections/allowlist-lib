---
to: src/allowlist/operations/<%= h.changeCase.paramCase(operationName) %>/<%= h.changeCase.paramCase(operationName) %>.types.ts
unless_exists: true
---
export interface <%= operationName %>Params {}
