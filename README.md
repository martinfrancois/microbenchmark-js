# JavaScript benchmark template

Compare small JavaScript functions with TypeScript and [Tinybench](https://github.com/tinylibs/tinybench).
The example sums 1,000 integers with a loop and `Array.reduce`.
It checks the answers before timing and reports measurements from your machine.

## Why Tinybench instead of Benchmark.js

We chose Tinybench for this template because it is maintained, includes
TypeScript declarations, supports ESM and async functions, and has no runtime
dependencies. [Vitest also uses it for benchmarking](https://vitest.dev/guide/features.html#benchmarking).
[Benchmark.js was archived in April 2024](https://github.com/bestiejs/benchmark.js),
so Tinybench is a better maintenance fit for a new TypeScript starter.

The measurement approaches have different strengths. Benchmark.js times batches
of repeated operations, which spreads timer overhead across those operations.
Tinybench normally times each call, preserving variation between calls for
latency percentiles and outlier analysis. For extremely short operations, that
per-call timer overhead distorts measurements unless the benchmark accounts for
it. Tinybench documents [overhead correction and manual batching](https://github.com/tinylibs/tinybench#timer-overhead-correction).
Batching produces samples of batch averages, so its percentiles no longer
describe individual calls.

This choice does not claim that Tinybench is more accurate for every workload.
Check the measurement overhead, warm up the runtime, and repeat meaningful runs
before drawing conclusions. Passing CI verifies correctness and execution;
it does not validate a performance ranking.

## Start a benchmark

Create your own repository with GitHub's **Use this template** button once the
owner enables the template setting, or clone this repository. Use Node 24,
with the exact development version recorded in `.nvmrc`.

```sh
nvm use
npm ci
npm run bench
```

`nvm` is optional if the matching Node version is already installed.
`npm start` runs the same benchmark.

To compare your own code:

1. Replace the functions and case names in `src/cases.ts`.
2. Change the input and expected answer in `src/index.ts`.
3. Update `test/cases.test.mjs` to cover representative inputs and edge cases.
4. Run `npm run check`, then `npm run bench`.

Keep setup and correctness assertions outside the timed callback. Each callback
stores its result for a check after the run; that storage adds the same overhead
to both examples. For very small operations, measure that overhead or increase
the work per callback. Repeat runs with inputs that reflect your application.
The sample does not establish which approach is best for another workload.

## Check changes

```sh
npm run check
```

This type-checks the source, compiles it, tests the example's answers, and runs a
short benchmark. `npm run bench:smoke` runs only the short execution check.
Smoke timings are not performance evidence. Benchmark exceptions fail the command.
GitHub Actions runs the same checks on pull requests and pushes to `main`.
The required job name is `test`; CI does not compare performance rankings.

## Make the template your own

Update the package name, author, README, and license details for your project.
`private: true` prevents npm publication; it does not control GitHub visibility.
This repository remains private while publication review is pending.

Renovate follows the owner's private-repository policy: Friday updates in
Europe/Zurich, a seven-day release age, pinned dependencies and action digests,
and separate reviewed major updates. Security alerts bypass the ordinary age
and schedule restrictions. Replace the reviewer in `renovate.json` when copying
this template to another account.

Automatic merging starts disabled. After confirming Renovate enrollment and a
successful Actions run, require the `test` check in a branch rule before enabling
non-major automerge. Keep major updates under human review. Before publishing,
remove the private schedule and broad grouping rules, set
`separateMultipleMajor` to `true`, and keep coordinated toolchain updates together.

The previous version used the Benchmark.js README's string-search example.
This version replaces that example and runner with an array-sum comparison.
Project code uses the [ISC license](LICENSE); dependencies retain their own licenses.
