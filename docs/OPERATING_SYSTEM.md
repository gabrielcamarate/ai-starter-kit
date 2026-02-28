# Operating System do Projeto

Este documento define o ritual operacional padrão para usar o `ai-starter-kit` no dia a dia.

## Ritual obrigatório
1. `registry-first`:
   - Antes de usar ou criar skill, consultar `skills/registry.json`.
   - Preferir skill existente com `status=active`.
2. `doc-first`:
   - Se a skill tiver `requires_docs=true`, pesquisar documentação antes de codar.
   - Preferência: MCP Context7 (quando disponível).
   - Fallback: documentação oficial, README e fontes locais confiáveis.
3. `plan-then-code`:
   - Escrever plano curto (objetivo, passos, validação) antes da implementação.
4. `validate-before-finish`:
   - Executar validações relevantes (test/lint/typecheck/security) antes de concluir.

## Evidência mínima de Documentation Research
Quando `requires_docs=true`, registrar no plano:
- Sources
- Key constraints
- Version (quando aplicável)

## Quickstart operacional
### Criar projeto
```bash
pnpm askit init meu-projeto --template react-ts
```

### Criar skill
```bash
pnpm askit new:skill revisar-pr --path ./meu-projeto
```

### Auditar projeto
```bash
pnpm askit audit --path ./meu-projeto
```

## Aplicar em projeto existente (retrofit)
1. Rodar `audit` e priorizar itens `CRÍTICO` e `HIGH`.
2. Garantir `controls/doc_first.md` e `skills/registry.json`.
3. Migrar skills legadas para formato v2.
4. Reexecutar `audit` e checks locais.
