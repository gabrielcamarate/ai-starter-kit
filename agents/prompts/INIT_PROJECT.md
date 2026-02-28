# Prompt Pack: INIT_PROJECT

Use este prompt para iniciar um projeto novo com padrão do `ai-starter-kit`.

## Regras obrigatórias
1. Consultar `skills/registry.json` antes de executar qualquer ação.
2. Fazer plano curto antes de codar:
   - Objetivo
   - Passos
   - Validações esperadas
3. Se a skill escolhida tiver `requires_docs=true`, aplicar Doc-first:
   - usar MCP Context7 quando disponível;
   - registrar Sources, Key constraints e Version (quando aplicável).
4. Antes de finalizar, executar validações:
   - testes relevantes
   - lint/typecheck aplicáveis
   - checagens de segurança aplicáveis

## Fluxo sugerido
1. Validar nome/template alvo.
2. Executar `askit init`.
3. Confirmar estrutura base e template.
4. Rodar checks mínimos do projeto gerado.
5. Reportar resultado e próximos passos.
