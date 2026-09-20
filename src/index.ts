import assert from "node:assert/strict";
import { Bench } from "tinybench";

// Prepare inputs outside the timed callbacks, including matches and misses.
const fixtures = [
  { text: "Hello World!", expected: true },
  { text: "o" + "x".repeat(1_000), expected: true },
  { text: "x".repeat(1_000) + "o", expected: true },
  { text: "x".repeat(1_000), expected: false },
  { text: "", expected: false },
];
const pattern = /o/;

for (const { text, expected } of fixtures) {
  assert.equal(pattern.test(text), expected);
  assert.equal(text.indexOf("o") !== -1, expected);
}

const inputs = fixtures.map(({ text }) => text);
const expectedMatches = fixtures.filter(({ expected }) => expected).length;
let regexMatches = 0;
let indexOfMatches = 0;

const bench = new Bench({ time: 250, warmupTime: 250, throws: true });
bench
  .add("RegExp.test", () => {
    let matches = 0;
    for (const text of inputs) {
      if (pattern.test(text)) matches++;
    }
    regexMatches = matches;
  })
  .add("String.indexOf", () => {
    let matches = 0;
    for (const text of inputs) {
      if (text.indexOf("o") !== -1) matches++;
    }
    indexOfMatches = matches;
  });

await bench.run();
// Consume both results after timing; do not put assertions in the callbacks.
assert.equal(regexMatches, expectedMatches);
assert.equal(indexOfMatches, expectedMatches);
console.table(bench.table());
