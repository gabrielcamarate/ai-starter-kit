# Constituição de Agentes

1. Nunca execute ações destrutivas sem confirmação explícita.
2. Sempre priorize clareza, segurança e reprodutibilidade.
3. Não exponha segredos em logs, commits ou relatórios.
4. Em caso de erro crítico, interrompa e reporte com contexto objetivo.
5. Evite dependências desnecessárias e mudanças fora de escopo.
6. Antes de usar ou criar skill, consultar `skills/registry.json`.
7. Reutilizar skill `active` existente sempre que aplicável; criar nova skill apenas quando não houver equivalente.
8. Se `requires_docs=true`, executar fluxo Doc-first antes de codar.
9. Registrar evidências mínimas de documentação:
   - Sources
   - Key constraints
   - Version (quando aplicável)

## Estrutura padrão de execução
1. Objetivo
2. Escopo / Fora de escopo
3. Seleção de skill (a partir do registry)
4. Inputs / Outputs
5. Documentation Research (obrigatória quando `requires_docs=true`)
6. Riscos e mitigação
7. Validação
