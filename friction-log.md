# DA CLI Friction Log

## 2026-05-21 Initial Build

- `site create` helped create the repo, but the virgin boilerplate still needed `fstab.yaml` added manually after the repo and DA site were created separately.
- The boilerplate only includes core blocks (`hero`, `cards`, `columns`, `fragment`, header, footer). A full-gambit site needs a block-library scaffold command or a blueprint-driven primitive installer.
- `content put` can upload HTML documents, but the authoring loop still requires hand-maintained source files and repeated commands. A pipeline-native "upload content tree, preview, quality gate, reconcile" workflow would reduce operator load.
- `site reconcile --apply` currently plans repairs but does not mutate content. That is acceptable for safety, but the next high-leverage step is controlled, reviewable patch generation for local content sources.
- Bulk upload scripting exposed an operator footgun: in `zsh`, assigning to a variable named `path` mutates the shell `PATH`, which caused `node` to disappear mid-loop. da-cli should provide first-class content tree upload/pipeline execution so site generation does not depend on fragile shell loops.
- Preview is nested (`preview page /index`) while the pipeline examples are easy to write as `preview /index`. da-cli could either accept the shorthand or make generated pipeline templates use the subcommand explicitly.
- Browser validation caught issues that DA audit and quality-gate missed: JS console failures from fragment preview gaps, a brittle header brand assumption, and metadata tables becoming visible block load errors. The pipeline gate needs an optional browser-console phase after preview.
