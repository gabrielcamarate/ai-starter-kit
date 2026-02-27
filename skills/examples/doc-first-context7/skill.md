# Skill: doc-first-context7

## Objetivo
Demonstrar como executar o fluxo Doc-first antes de implementar mudança com API/lib desconhecida.

## Procedimento passo a passo
1. Consultar `skills/registry.json` para confirmar se já existe skill aplicável.
2. Confirmar `requires_docs=true` na skill selecionada.
3. Usar o MCP server Context7 para buscar a documentação do pacote alvo.
4. Registrar no plano:
   - Sources
   - Key constraints
   - Version (quando aplicável)
5. Só então iniciar implementação.

## Exemplo de registro de evidência
### Sources
- Context7: documentação oficial da biblioteca X.

### Key constraints
- Função Y exige parâmetro Z obrigatório.
- Endpoint A retorna paginação por cursor.

### Version (quando aplicável)
- Biblioteca X v2.4.1
