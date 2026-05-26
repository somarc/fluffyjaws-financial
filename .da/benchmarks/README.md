# FluffyCoins Moonshot Benchmark

This benchmark is intentionally fictional. It creates an absurd FluffyCoins narrative page with a custom `price-chart` block so agents can exercise DA CLI primitives across content, block code, style, preview, and audit workflows.

## Preflight

Run this first. It performs local quality checks, dry-runs block code sync for the new JavaScript and CSS files, dry-runs the DA content upload, and gathers an agent site briefing. It should not mutate DA or GitHub.

```sh
node ../da-cli/src/index.js --org somarc --repo fluffyjaws-financial pipeline run .da/benchmarks/fluffycoins-moonshot-preflight.yaml
```

## Release Benchmark

This pipeline is designed for the committing path. Run it only after the block code has been committed, pushed, and is ready to sync to the codebus. It uploads the benchmark content, previews the new route, explains the preview, verifies authored block assets, and runs a final agent doctor pass.

```sh
node ../da-cli/src/index.js --commit pipeline run .da/benchmarks/fluffycoins-moonshot.yaml
```

The release pipeline intentionally keeps `--commit` at the root command level. Step-local commit flags are not used, so the dry-run and mutation paths stay visibly separate.
