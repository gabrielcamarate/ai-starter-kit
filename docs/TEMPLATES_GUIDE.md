# Templates Guide

## Como adicionar um novo template
1. Criar pasta em `packages/templates/project-templates/<nome>/template`.
2. Adicionar `README.md` do template.
3. Atualizar `packages/templates/catalog.json`.
4. Atualizar validação em `scripts/validate-templates.mjs`.
5. Validar com `pnpm validate:templates`.

## Requisitos do base template (obrigatórios)
- Incluir `controls/doc_first.md`.
- Incluir `skills/registry.json`.
- Manter exemplos e modelos de skills no formato v2.

## Skills e scaffolds
- `packages/templates/scaffolds/skill.md` define o contrato de conteúdo da skill.
- `packages/templates/scaffolds/skill.meta.json` define metadata mínima obrigatória.
- `meta.json` deve manter:
  - `name` em kebab-case
  - `status` (`active` ou `deprecated`)
  - `requires_docs` e evidências de documentação quando aplicável
