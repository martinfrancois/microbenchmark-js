export function sumWithLoop(values: readonly number[]): number {
  let total = 0;
  for (const value of values) total += value;
  return total;
}

export function sumWithReduce(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export const cases = [
  { name: "for...of", run: sumWithLoop },
  { name: "Array.reduce", run: sumWithReduce },
];
