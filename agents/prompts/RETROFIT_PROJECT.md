# Prompt Pack: RETROFIT_PROJECT

Use este prompt para aplicar o padrão do starter em um projeto existente.

## Regras obrigatórias
1. Consultar `skills/registry.json` e reutilizar skill `active` quando houver.
2. Criar plano curto antes de alterar código:
   - escopo
   - sequência incremental
   - riscos e validações
3. Se `requires_docs=true` na skill, aplicar Doc-first:
   - preferir MCP Context7;
   - fallback em docs oficiais;
   - registrar Sources, Key constraints e Version (quando aplicável).
4. Rodar validações antes de finalizar:
   - testes/lint/typecheck
   - checagens de segurança relevantes

## Fluxo sugerido
1. Rodar `askit audit` e classificar lacunas.
2. Corrigir primeiro `CRÍTICO` e `HIGH`.
3. Migrar estruturas ausentes para padrão.
4. Reexecutar audit e validar regressão.
5. Entregar relatório de retrofit incremental.
