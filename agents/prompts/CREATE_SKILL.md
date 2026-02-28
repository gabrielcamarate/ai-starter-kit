# Prompt Pack: CREATE_SKILL

Use este prompt para criar ou evoluir skills no padrão v2.

## Regras obrigatórias
1. Consultar `skills/registry.json` antes de criar skill nova.
2. Evitar duplicidade: se já existir skill equivalente `active`, reutilizar ou atualizar.
3. Fazer plano curto antes de codar:
   - skill alvo
   - arquivos a alterar
   - validações
4. Se `requires_docs=true`, aplicar Doc-first:
   - Context7 quando disponível;
   - fallback documentado quando indisponível;
   - evidência mínima: Sources, Key constraints, Version.
5. Executar validações finais:
   - testes do CLI
   - lint/typecheck
   - validações de estrutura/templates

## Checklist de saída
- Skill criada em `skills/<name>/skill.md` + `meta.json`.
- Registry atualizado de forma determinística.
- Sem quebrar compatibilidade legada.
