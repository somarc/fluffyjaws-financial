# FluffyJaws Financial

Fictional Edge Delivery Services demo site for stress-testing `da-cli` intent-to-site workflows.

## Environments

- Preview: https://main--fluffyjaws-financial--somarc.aem.page/
- Live: https://main--fluffyjaws-financial--somarc.aem.live/
- DA: https://da.live/#/somarc/fluffyjaws-financial

## Local Development

```sh
npm i
npx aem up
```

## DA CLI Workflow

Use the local feature-branch CLI from the sibling checkout:

```sh
node ../da-cli/bin/da.js --org somarc --repo fluffyjaws-financial content put /index content/index.html
node ../da-cli/bin/da.js --org somarc --repo fluffyjaws-financial pipeline quality-gate /index --min-score 85
```

Content files under `content/` are source documents intended for DA upload. The `blocks/` directory contains the extra primitives needed for the full-gambit site exercise.
