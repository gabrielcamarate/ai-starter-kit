# Skills

Skills são instruções operacionais reutilizáveis para tarefas recorrentes.

## Formato v2 (padrão)
- Uma skill é uma pasta: `skills/<skill-name>/`
- Arquivos obrigatórios:
  - `skill.md`
  - `meta.json`
- `skill-name` deve ser kebab-case e único no registry.

## Registry
- `skills/registry.json` é a fonte de descoberta para agentes.
- O CLI atualiza automaticamente o registry ao executar `new:skill`.
- Ordem do registry é determinística (alfabética por `name`).
- Skills `deprecated` permanecem visíveis para rastreabilidade.

## Compatibilidade legada
- Skills antigas em `skills/*.md` ainda podem ser lidas.
- Em colisão de nome entre legacy e v2, a v2 prevalece no registry.

## Como escrever
1. Comece por objetivo, escopo e fora de escopo.
2. Defina inputs/outputs e pré-condições.
3. Descreva o procedimento passo a passo.
4. Inclua checklist de validação, riscos e critérios de saída.
5. Se `requires_docs=true`, preencha Documentation Research com:
   - Sources
   - Key constraints
   - Version (quando aplicável)

Use os modelos em `skills/templates/` e exemplos em `skills/examples/`.
