# Reusable UX skill handoff

The `evidence-led-ux` package is independent of this website. It has no runtime dependency on this repository, its content, technology or brand. The repository is only the staging location for the reusable package.

## Deliverables

- [Skill entrypoint](../skills/evidence-led-ux/SKILL.md)
- [Research and sources](../skills/evidence-led-ux/references/evidence.md)
- [Twenty visual nuances](../skills/evidence-led-ux/references/visual-review.md)
- [Interaction and accessibility guidance](../skills/evidence-led-ux/references/interaction-review.md)
- [Verification guidance](../skills/evidence-led-ux/references/verification.md)
- [Global instruction to add](../skills/evidence-led-ux/references/global-rule.md)
- [Behavioural scenarios](../skills/evidence-led-ux/evals/scenarios.md)

## Global installation

Extract the `evidence-led-ux` folder from `evidence-led-ux.zip` into your global Codex skills directory: `$CODEX_HOME/skills`, or `C:/Users/gunna/.codex/skills` when CODEX_HOME is unset. The result must have `evidence-led-ux/SKILL.md` directly under that skills directory, not a second nested copy of the folder. Preserve any existing skill of the same name rather than overwriting it without review.

Add the paragraph from [global-rule.md](../skills/evidence-led-ux/references/global-rule.md) to your global agent instructions if you want an explicit standing rule. The skill's metadata permits automatic selection; that setting alone is not proof that an installed host will load it on every task. Start a new session and confirm it appears in the available-skills list. It can also be requested explicitly as `$evidence-led-ux`.

This session's filesystem permissions allow writes only in the current workspace and temporary directories. The package is staged here; the global skills directory and global agent instructions have not been modified.

## Work and verification

- [x] Research primary sources and compare the existing design skills.
- [x] Define scenario acceptance criteria before authoring the reusable guidance.
- [x] Write purpose-sensitive instructions and supporting references.
- [x] Validate package structure, references and portability.
- [x] Create the reusable archive.

Validation: the skill-creator validator passed. All five relative links in the skill entrypoint resolve inside the portable package. Eight files were checked for project coupling and unfinished content; none was found. The archive's eight entries were inspected, including its skill entrypoint and metadata.

The follow-up revision adds explicit contextual CTA review: inventory persistent actions before adding body duplicates, repair breakpoint-specific access gaps, and retain necessary local transaction controls. Two additional scenarios cover redundant sticky/body booking links and legitimate item-specific actions. The refreshed ZIP has been checked against all eight source files.

Manual instruction review considered editorial reading, dense dashboard comparison, mixed accordion requirements, screenshot-only evidence and conflicts with visual recipes. The instructions retain the respective task priorities and explicitly limit claims to available evidence. This was author self-review, not independent execution of the scenarios, an accessibility audit or a participant study.

The scenario file defines acceptance criteria; it is not an automated test suite or evidence of independent user testing. No website implementation changes are part of this skill-creation task.
