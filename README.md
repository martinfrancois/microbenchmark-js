# JavaScript benchmark template

A small TypeScript starting point for comparing JavaScript code with
[Tinybench](https://github.com/tinylibs/tinybench). Edit `src/index.ts` to write
your own benchmark. The example compares `/o/.test(text)` with
`text.indexOf("o") !== -1`, using the same inputs for both.

## Run

Use Node 24, with the exact development version recorded in `.nvmrc`.
Clone the repository, or use GitHub's **Use this template** button once enabled.

```sh
nvm use
npm ci
npm run bench
```

`nvm` is optional if the matching Node version is already installed.
`npm start` runs the same benchmark. `npm run check` compiles and runs it too;
GitHub Actions uses that command to catch type errors, failed assertions and
benchmark exceptions. CI does not gate changes on speed rankings.

## Write your benchmark

Keep everything in `src/index.ts`:

1. Replace the fixtures and expected results with representative inputs.
2. Update the correctness assertions and the two `.add` callbacks together.
3. Keep input preparation and assertions outside the timed callbacks.
4. Consume each implementation's result after the run, as the match counts do.
5. Adjust the warmup and measurement durations in `new Bench` when needed.

The example reuses one regex without `g` or `y` flags, so searches have no
`lastIndex` state. Regex construction is excluded from the timing. Fixtures
include early and late matches, a missing character, and an empty string.

Each timed callback searches the entire input array. The reported time and
throughput describe **one batch**, including the loop and match counting.
They are not measurements of one string search. Batching reduces timer overhead
per search, but loop overhead and JavaScript engine optimizations still matter.
Batch percentiles describe variation between batches, not individual searches.

Repeat runs with inputs that reflect your workload. Record your Node version
and hardware when sharing results. Compare uncertainty as well as averages;
this example does not establish a universal winner.

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

## Repository setup

Update the package name, author, README and license details when copying this
template. `private: true` prevents npm publication; it does not control GitHub
visibility. This repository stays private while publication review is pending.

Renovate follows the owner's private-repository policy: Friday updates in
Europe/Zurich, a seven-day release age, pinned dependencies and action digests,
and separate reviewed major updates. Security alerts bypass ordinary age and
schedule restrictions. Change the reviewer when copying to another account.

Automerge starts disabled. Verify Renovate enrollment and require the `test`
CI check before enabling non-major automerge. Keep majors under human review.
Before publishing, remove the private schedule and broad grouping rules, set
`separateMultipleMajor` to `true`, and retain coordinated toolchain updates.

The regex versus `indexOf` comparison comes from the
[Benchmark.js README example](https://github.com/bestiejs/benchmark.js#readme).
Its MIT notice is retained in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
The remaining project code uses [ISC](LICENSE).
