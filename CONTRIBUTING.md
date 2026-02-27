# Contribuindo

## Ambiente
- Node.js >= 18
- PNPM

## Fluxo de contribuição
1. Crie branch dedicada.
2. Execute `pnpm ci:local` antes de abrir PR.
3. Abra PR com escopo claro e checklist de testes.

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

Exemplo:
```text
feat: add lockfile and missing CI audit checks

What changed: added lockfile and CI presence checks to the audit command.
Why: reduce non-deterministic builds and avoid repositories without automated validation.
```
