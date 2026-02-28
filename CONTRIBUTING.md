# Contribuindo

## Ambiente
- Node.js >= 18
- PNPM

## Fluxo de contribuição
1. Crie branch dedicada.
2. Execute `pnpm ci:local` antes de abrir PR (inclui smoke test de templates).
3. Abra PR com escopo claro e checklist de testes.
4. Para merge em `main`, é obrigatório passar pelos requisitos de proteção da branch.

Fluxo operacional diário:
- seguir `docs/OPERATING_SYSTEM.md` (registry-first, doc-first, plan-then-code).

## Política de commits (obrigatória)
1. Nunca use `git add .`.
2. Sempre adicione arquivos explicitamente.
3. Prefixos permitidos: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`.
4. Todos os commits devem ser escritos em inglês.
5. O corpo do commit deve conter:
   - `What changed:`
   - `Why:`
6. Não utilizar mensagens bilíngues.
7. Não duplicar mensagens em português.
8. Toda mensagem deve explicar o que foi alterado e por que foi alterado.
9. O CLI não deve gerar commits automáticos genéricos.
10. Mensagens genéricas proibidas: `update`, `fix bug`, `changes`.
11. Do not include escaped newline sequences like `\\n` in commit/PR text.
12. Use real multi-line text with real bullets.

Exemplo:
```text
feat: add lockfile and missing CI audit checks

What changed:
- added lockfile and CI presence checks to the audit command.

Why:
- reduce non-deterministic builds and avoid repositories without automated validation.
```

## Governança da branch `main`
- Pull request obrigatório para merge.
- Aprovação obrigatória com `require_code_owner_reviews` habilitado.
- CODEOWNERS obrigatório: mudanças no repositório exigem revisão de `@gabrielcamarate`.
- Histórico linear obrigatório (`Require linear history`).
- Merges permitidos: `Squash` e `Rebase`.
- Merge commit direto desabilitado (`allow_merge_commit=false`).
- Auto-merge permitido para PRs que já satisfazem checks e proteções.

## Pós-merge automático
- O workflow `.github/workflows/post-merge.yml` executa automaticamente quando um PR é merged na `main`.
- O workflow comenta `Merged successfully ✅` no PR.
- O workflow registra no log se a branch de origem foi removida.
- O workflow não altera código automaticamente.

## Skills v2 e Doc-first
- Antes de usar ou criar skills, consultar `skills/registry.json`.
- Novas skills devem usar formato v2:
  - `skills/<skill-name>/skill.md`
  - `skills/<skill-name>/meta.json`
- `meta.json` deve conter `status` (`active` ou `deprecated`).
- Se `requires_docs=true`, registrar evidência mínima de pesquisa:
  - Sources
  - Key constraints
  - Version (quando aplicável)
