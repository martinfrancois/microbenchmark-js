# microbenchmark-js

A small TypeScript template for writing JavaScript microbenchmarks with
[Tinybench](https://github.com/tinylibs/tinybench). Edit `src/index.ts` to write
your own benchmark. The example compares `/o/.test(text)` with
`text.indexOf("o") !== -1`, using the same inputs for both.

## Run

Use Node 24, with the exact development version recorded in `.nvmrc`.
Create a repository with [Use this template](https://github.com/martinfrancois/microbenchmark-js/generate),
or clone this repository.

```sh
nvm use
npm ci
npm run bench
```

`nvm` is optional if the matching Node version is already installed.
`npm run bench` compiles and runs the benchmark. GitHub Actions uses the same
command to catch type errors, failed assertions and
benchmark exceptions. CI does not gate changes on speed rankings.

### Example output

One run with Node 24.20.0 and Tinybench 6.2.0 printed:

```text
┌─────────┬──────────────────┬──────────────────┬──────────────────┬────────────────────────┬────────────────────────┬─────────┐
│ (index) │ Task name        │ Latency avg (ns) │ Latency med (ns) │ Throughput avg (ops/s) │ Throughput med (ops/s) │ Samples │
├─────────┼──────────────────┼──────────────────┼──────────────────┼────────────────────────┼────────────────────────┼─────────┤
│ 0       │ 'RegExp.test'    │ '69.33 ± 0.07%'  │ '67.00 ± 2.00'   │ '14722917 ± 0.01%'     │ '14925373 ± 459242'    │ 3605867 │
│ 1       │ 'String.indexOf' │ '39.72 ± 0.05%'  │ '38.00 ± 1.00'   │ '26000586 ± 0.01%'     │ '26315790 ± 711237'    │ 6293473 │
└─────────┴──────────────────┴──────────────────┴──────────────────┴────────────────────────┴────────────────────────┴─────────┘
```

In this run, `String.indexOf` had lower average latency and higher average
throughput. Each operation is a batch of all five inputs. The `±` percentages
in the average columns show relative margins of error; `Samples` counts measured
batches. Results vary with the machine, runtime and inputs. Repeat measurements
before drawing a performance conclusion; the template does not print a
statistical "Fastest is" verdict.

## Write your benchmark

Keep everything in `src/index.ts`:

1. Replace the fixtures and expected results with representative inputs.
2. Update the correctness assertions and the two `.add` callbacks together.
3. Keep fixture preparation and assertions outside the timed callbacks. Include
   construction or allocation when that cost is part of the operation you want
   to compare.
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

## Build a trustworthy comparison

Use this checklist whether you write the benchmark yourself or ask an agent to
write it. The 250 ms warmup and measurement settings keep this example quick;
they are starting values, not evidence that a measurement is stable.

1. State the question and the unit before measuring. Check that both versions
   produce equivalent answers. Choose realistic input sizes and match/miss
   frequencies; this example's five fixtures are only a demonstration. Report
   important cases separately when an average hides different behavior.
2. Keep the work comparable on every iteration. Reset mutable inputs when
   necessary, including during warmup. Exclude test setup, assertions and logging
   from timing. For async work, return or await its completion; starting work and
   discarding the promise measures a different operation. Keep concurrency off
   unless concurrent execution is the question.
3. Check what the optimizer actually measures. Consume results, but do not
   assume that this prevents constant folding or moving repeated work out of a
   loop. Use representative, varied inputs. Extra loops and subtracting an empty
   loop's time do not guarantee an isolated operation cost. Read
   [Vyacheslav Egorov's explanation of microbenchmark traps](https://mrale.ph/blog/2012/12/15/microbenchmarks-fairy-tale.html).
   Its 2012 V8 examples explain the mechanisms, not today's exact engine behavior.
4. Check timer limits before trusting tiny differences. Tinybench's
   [precision FAQ](https://github.com/tinylibs/tinybench/blob/v6.2.0/FAQ.md#how-do-i-deal-with-measurement-precision-issues)
   explains `detectedResolution`, timer providers and the `warning` event.
   Attach a warning listener when investigating very fast tasks; this starter
   only prints the result table. These diagnostics are heuristics; no warning
   does not prove accuracy. Neither does a small relative margin of error, or
   RME. More samples do not fix insufficient timer resolution.
   With manual batching, label results per batch and account for loop overhead.
5. Repeat in fresh Node processes on the same quiet machine. Keep runtime,
   power settings and background load comparable. With warmup enabled, reported
   measurements target warmed code; startup requires a separate experiment.
   Increase warmup and measurement
   durations and check whether the conclusion holds. Reverse task order to
   check for order effects. Investigate garbage collection and optimization
   changes rather than deleting slow samples to obtain a preferred result. See
   [Tinybench's explanation of JIT and variance](https://github.com/tinylibs/tinybench/blob/v6.2.0/FAQ.md#what-is-js-jit-de-optimization).
6. Save all runs and compare the size of the difference with uncertainty and
   variation between runs. If the ranking changes with order or repeat runs,
   report the result as inconclusive. Confirm any useful improvement in the
   application workload before claiming a user-facing speedup. The V8 team
   explains [why synthetic scores do not establish real-world performance](https://v8.dev/blog/real-world-performance).

When sharing results, include the question, code revision, input cases, command,
Node/V8 and Tinybench versions, OS/CPU, warmup and measurement settings, batch
size, units and output from every run. State what the benchmark excludes and
which conclusions the results support. An agent should provide the commands and
observed results, and say explicitly if it has not run the benchmark.

For implementation details, start with [Tinybench's usage guide](https://github.com/tinylibs/tinybench/blob/v6.2.0/README.md#usage)
and [BenchOptions reference](https://tinylibs.github.io/tinybench/interfaces/BenchOptions.html)
for timing, warmup and concurrency controls. The README and FAQ links target
Tinybench 6.2.0; the API site follows the latest release. Check the installed
version in `package-lock.json` and its TypeScript declarations before using a new
option. For more on repeated measurements and uncertainty, read the
[Node.js benchmark guide](https://github.com/nodejs/node/blob/main/doc/contributing/writing-and-running-benchmarks.md).
Its commands belong to Node core's benchmark suite, not this template.

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

GitHub Actions runs `npm run bench` on pull requests and pushes to `main`.
Require the `test` check in your branch protection settings or ruleset before
enabling Renovate for your repository. Install or enable Renovate for your
repository, then replace or remove `martinfrancois` in its `reviewers` setting.
Repository settings and app access need to be configured on your new repository.

Renovate pins dependencies and action digests, waits seven days for ordinary
releases, and keeps unrelated updates separate. Node and TypeScript tooling is
grouped for coordinated updates. Eligible non-major
updates merge after checks pass; major updates require review. Node runtime
updates also require review so `.nvmrc` and `engines.node` stay aligned.
Security updates bypass the ordinary release-age restriction.

## License

This project uses the [ISC license](LICENSE).

The idea of comparing regex with `indexOf` was inspired by the
[Benchmark.js README example](https://github.com/bestiejs/benchmark.js#readme).
