import { AllowlistOperationCode } from '../allowlist/allowlist-operation-code';
import { BadInputError } from './../allowlist/bad-input.error';
// The `assertUnreachable` function takes an input `_x` of type `never` and always throws
// an error. This function is typically used in TypeScript to assert exhaustiveness in

// switch-case or if-else constructs, ensuring that all possible cases are handled.
export const assertUnreachable = (_x: never): never => {
  // Throw an error with a message indicating that this function should not be reached.
  // This error should only be thrown if there's a bug in the code or a new case has been
  // introduced without updating the relevant switch-case or if-else constructs.
  throw new Error("Didn't expect to get here");
};

export const isValidTokenIds = (tokenIds: string): boolean => {
  // Remove all whitespaces
  const cleanedInput = tokenIds.replace(/\s+/g, '');
  const regex = /^(\d+-\d+|\d+)(,\d+-\d+|,\d+)*$/;
  return regex.test(cleanedInput);
};

export const parseTokenIds = (
  input: string | null,
  poolId: string,
  code: AllowlistOperationCode,
): string[] | null => {
  if (!input) {
    return null;
  }

  if (!isValidTokenIds(input)) {
    throw new BadInputError(
      `${code}: TokenIds must be in format: 1, 2, 3, 45, 100-115, 203-780, 999, id: ${poolId}`,
    );
  }
  const cleanedInput = input.replace(/\s+/g, '');

  // Split the input by comma and process each part
  const parts = cleanedInput.split(',');
  const resultSet = new Set<bigint>();

  for (const part of parts) {
    // Check if the part is a range (e.g., 4-6)
    const rangeMatch = part.match(/^(\d+)-(\d+)$/);

    if (rangeMatch) {
      const start = BigInt(rangeMatch[1]);
      const end = BigInt(rangeMatch[2]);

      // Add all numbers in the range to the result set
      for (let i = start; i <= end; i++) {
        resultSet.add(i);
      }
    } else {
      // If the part is a single number, add it to the result set
      resultSet.add(BigInt(part));
    }
  }

  // Convert the result set to an array and return it
  return Array.from(resultSet).map((it) => it.toString());
};
