import assert from "node:assert/strict";
import { cpus } from "node:os";
import { Bench } from "tinybench";
import { cases } from "./cases.js";

const args = process.argv.slice(2);
if (args.some((arg) => arg !== "--smoke")) {
  throw new Error("Usage: npm run bench -- [--smoke]");
}
const smoke = args.includes("--smoke");
const values = Array.from({ length: 1_000 }, (_, index) => index);
const expected = 499_500;
const bench = new Bench({
  name: "Sum 1,000 integers",
  time: smoke ? 10 : 1_000,
  iterations: smoke ? 2 : 64,
  warmup: !smoke,
  throws: true,
});

const results = new Map<string, number>();
for (const example of cases) {
  assert.equal(example.run(values), expected, `${example.name}: incorrect sum`);
  bench.add(example.name, () => {
    results.set(example.name, example.run(values));
  });
}

console.log(`${process.version} | ${process.platform}/${process.arch} | ${cpus()[0]?.model ?? "unknown CPU"}`);
if (smoke) console.log("Smoke run: execution check only; ignore these timings.");
await bench.run();
for (const example of cases) {
  assert.equal(results.get(example.name), expected, `${example.name}: no successful result`);
}
console.table(bench.table());
