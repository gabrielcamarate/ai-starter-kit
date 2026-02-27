# Control: doc_first

## Objetivo
Exigir pesquisa de documentação antes de implementar mudanças que dependam de APIs, bibliotecas ou frameworks.

## Ritual obrigatório antes de codar
1. Consultar `skills/registry.json`.
2. Selecionar a skill e verificar `requires_docs`.
3. Se `requires_docs=true`, pesquisar docs (Context7 quando disponível, fallback em docs oficiais/locais).
4. Registrar evidência mínima:
   - Sources
   - Key constraints
   - Version (quando aplicável)

## Regras
- Não codar com API nova sem evidência de documentação.
- Em indisponibilidade do Context7, registrar limitação e fonte alternativa.
