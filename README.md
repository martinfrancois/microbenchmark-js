# JavaScript benchmark template

A small TypeScript starting point for comparing JavaScript code with
[Tinybench](https://github.com/tinylibs/tinybench). Edit `src/index.ts` to write
your own benchmark. The example compares `/o/.test(text)` with
`text.indexOf("o") !== -1`, using the same inputs for both.

## Run

Use Node 24, with the exact development version recorded in `.nvmrc`.
Create a repository with [Use this template](https://github.com/martinfrancois/js-performance-bench/generate),
or clone this repository.

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

## Set up your repository

Update the package name, author and README when copying this template. Retain
applicable copyright and license notices. `private: true` in `package.json`
prevents accidental npm publication; it does not restrict GitHub visibility.

GitHub Actions runs `npm run check` on pull requests and pushes to `main`.
Require the `test` check in your branch protection settings or ruleset before
enabling Renovate for your repository. Install or enable Renovate for your
repository, then replace or remove `martinfrancois` in its `reviewers` setting.
Repository settings and app access need to be configured on your new repository.

Renovate pins dependencies and action digests, waits seven days for ordinary
releases, and keeps unrelated updates separate. Node
and TypeScript tooling is grouped for coordinated updates. Eligible non-major
updates merge after checks pass; major updates require review. Node runtime
updates also require review so `.nvmrc` and `engines.node` stay aligned.
Security updates bypass the ordinary release-age restriction.

## License

The regex versus `indexOf` comparison comes from the
[Benchmark.js README example](https://github.com/bestiejs/benchmark.js#readme).
Its MIT notice is retained in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
The remaining project code uses [ISC](LICENSE).
