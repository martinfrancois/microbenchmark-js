import assert from "node:assert/strict";
import test from "node:test";
import { cases } from "../dist/cases.js";

for (const example of cases) {
  test(`${example.name} sums inputs without changing them`, () => {
    for (const [values, expected] of [
      [[], 0],
      [[7], 7],
      [[1, 2, 3], 6],
      [[-5, 2, -1], -4],
      [[0.5, 0.25, -0.125], 0.625],
    ]) {
      assert.equal(example.run(Object.freeze(values)), expected);
    }
  });
}
