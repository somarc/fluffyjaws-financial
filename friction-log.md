# DA CLI Friction Log

## 2026-05-21 Initial Build

- `site create` helped create the repo, but the virgin boilerplate still needed `fstab.yaml` added manually after the repo and DA site were created separately.
- The boilerplate only includes core blocks (`hero`, `cards`, `columns`, `fragment`, header, footer). A full-gambit site needs a block-library scaffold command or a blueprint-driven primitive installer.
- `content put` can upload HTML documents, but the authoring loop still requires hand-maintained source files and repeated commands. A pipeline-native "upload content tree, preview, quality gate, reconcile" workflow would reduce operator load.
- `site reconcile --apply` currently plans repairs but does not mutate content. That is acceptable for safety, but the next high-leverage step is controlled, reviewable patch generation for local content sources.
- Bulk upload scripting exposed an operator footgun: in `zsh`, assigning to a variable named `path` mutates the shell `PATH`, which caused `node` to disappear mid-loop. da-cli should provide first-class content tree upload/pipeline execution so site generation does not depend on fragile shell loops.
- Preview is nested (`preview page /index`) while the pipeline examples are easy to write as `preview /index`. da-cli could either accept the shorthand or make generated pipeline templates use the subcommand explicitly.
- Browser validation caught issues that DA audit and quality-gate missed: JS console failures from fragment preview gaps, a brittle header brand assumption, and metadata tables becoming visible block load errors. The pipeline gate needs an optional browser-console phase after preview.

## 2026-06-10 Codebus Sync Semantics

- For an externally hosted EDS codebase with the AEM sync GitHub app connected, commit + push is the canonical code deployment path. The GitHub app observes the pushed commit and moves code assets through codebus; authors should not need a separate DA CLI deploy step for ordinary code changes.
- `da code sync` still has real operational value, but it should be treated as a reconciliation and recovery primitive, not the happy-path deploy command. It is useful when a live or preview asset is stale after a push, when proving a single codebus path during an audit, when recovering from a missed webhook/sync delay, or when forcing a specific file to align with the current GitHub source.
- `da code status` and `da code verify` are the safer first checks. Use them to compare public preview/live assets with expected content before reaching for `da code sync`.
- DA-authored content remains separate from codebus. Content changes still require DA preview/publish, while code changes should normally flow from GitHub push through the AEM sync app.
- Derived artifacts such as `sitemap.xml` sit at the boundary: the config is codebus, but the generated sitemap reflects published content and may need page publish/re-publish plus a sitemap rebuild before live output matches the pushed config.
- The most reliable verification heuristic is to compare the exact asset or page on `aem.page` and `aem.live`. That preview/live delta is how stale codebus assets, unpublished DA content, and derived-artifact gaps surfaced during this build.
