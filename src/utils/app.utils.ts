import { AllowlistOperationCode } from '../allowlist/allowlist-operation-code';
import { BadInputError } from '../allowlist/bad-input.error';
import * as seedrandom from 'seedrandom';
import { CardStatistics } from '../app-types';

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

export function pickRandomUniqueItemsWithSeed<T>({
  array,
  count,
  seed,
}: {
  array: T[];
  count: number;
  seed: string;
}): Set<T> {
  const rng = seedrandom(seed); // Create a seeded random number generator
  const winners = new Set<T>(); // Use a Set to ensure unique winners

  // Generate x unique random items from the array
  while (winners.size < count) {
    const index = Math.floor(rng() * array.length);
    const item = array[index];
    if (winners.has(item)) {
      continue;
    }
    winners.add(item);
  }

  // Convert the winners set to an array and return it
  return winners;
}

export const getOwnersByCardStatistics = ({
  cards,
  type,
}: {
  cards: { id: string; owner: string }[];
  type: CardStatistics | null;
}): string[] => {
  if (!type) {
    return Array.from(new Set<string>(cards.map((card) => card.owner)));
  }
  switch (type) {
    case CardStatistics.TOTAL_CARDS:
      return cards.map((card) => card.owner);
    case CardStatistics.UNIQUE_CARDS:
      const owners = new Set<string>(cards.map((card) => card.owner));
      return Array.from(owners).flatMap((owner) => {
        const uniqueCards = new Set(
          cards.filter((card) => card.owner === owner).map((card) => card.id),
        );
        return Array.from({ length: uniqueCards.size }, () => owner);
      });

    default:
      assertUnreachable(type);
  }
};

export const setHasAnyOf = <T>(set: Set<T>, items: T[]): boolean => {
  for (const item of items) {
    if (set.has(item)) {
      return true;
    }
  }
  return false;
};
