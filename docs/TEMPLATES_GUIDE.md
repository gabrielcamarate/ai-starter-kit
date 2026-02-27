# Templates Guide

## Como adicionar um novo template
1. Criar pasta em `packages/templates/project-templates/<nome>/template`.
2. Adicionar `README.md` do template.
3. Atualizar `packages/templates/catalog.json`.
4. Atualizar validação em `scripts/validate-templates.mjs`.
5. Validar com `pnpm validate:templates`.
