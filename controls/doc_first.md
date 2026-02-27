# Control: doc_first

## Objetivo
Garantir que mudanças dependentes de API/lib/framework sejam implementadas somente após pesquisa de documentação confiável.

## Ritual obrigatório antes de codar
1. Consultar `skills/registry.json`.
2. Selecionar a skill e verificar `requires_docs`.
3. Se `requires_docs=true`, executar pesquisa de documentação:
   - Preferência: MCP Context7 quando disponível.
   - Fallback: documentação oficial, README do projeto e fontes locais confiáveis.
4. Registrar evidência mínima no plano:
   - Sources
   - Key constraints
   - Version (quando aplicável)

## Regras
- Não implementar mudança com API nova sem evidência de pesquisa.
- Não inventar comportamento de API sem fonte.
- Se Context7 estiver indisponível, registrar a limitação explicitamente.
