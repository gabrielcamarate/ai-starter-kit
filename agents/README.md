# Agents

Este diretório define regras e padrões para agentes automatizados no projeto.

- `agent_rules.md`: regras invariáveis (constituição).
- `prompts/`: prompt pack oficial para fluxos recorrentes (`INIT_PROJECT`, `RETROFIT_PROJECT`, `CREATE_SKILL`).

Uso recomendado:
1. Referenciar as regras no prompt inicial de qualquer agente.
2. Validar aderência durante PR review.
3. Reutilizar prompt pack para manter consistência operacional.
