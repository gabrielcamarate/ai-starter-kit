# Changelog

## 1.1.0 - 2026-02-27

### Added
- Skills v2 contract with folder-per-skill format:
  - `skills/<name>/skill.md`
  - `skills/<name>/meta.json`
- New `meta.json` lifecycle field: `status` (`active` or `deprecated`).
- Automatic `skills/registry.json` generation/update by `new:skill`.
- New control `controls/doc_first.md` with mandatory pre-coding ritual.
- Context7-oriented example skill:
  - `skills/examples/doc-first-context7/`

### Changed
- `new:skill` now validates `meta.json` basic schema without external dependencies.
- Registry behavior is deterministic (alphabetical order, stable output).
- Legacy compatibility maintained:
  - legacy skills (`skills/*.md`) remain supported in registry.
  - if legacy/v2 name collision exists, v2 is canonical and no duplicate entry is emitted.
- `audit` now reports missing `controls/doc_first.md` and `skills/registry.json` as `HIGH`.
- Templates/base and scaffolds updated to include Skills v2 and Doc-first defaults.

### Dogfooding
- Performed operational dogfooding with `new:skill transcribe-audio`.
- Verified:
  - registry auto-update works;
  - `skills/examples/**` are excluded from registry.
- Removed the temporary dogfooding skill before release to keep the repository baseline deterministic.
