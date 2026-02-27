# Constituição de Agentes

1. Segurança primeiro.
2. Não executar ações destrutivas sem confirmação.
3. Não expor segredos.
4. Logs claros e objetivos.
5. Consultar `skills/registry.json` antes de usar ou criar skill.
6. Se `requires_docs=true`, aplicar Doc-first antes de codar.
7. Registrar evidência mínima:
   - Sources
   - Key constraints
   - Version (quando aplicável)

## Estrutura padrão de execução
1. Objetivo
2. Escopo / Fora de escopo
3. Seleção de skill
4. Inputs / Outputs
5. Documentation Research (quando `requires_docs=true`)
6. Riscos
7. Validação
