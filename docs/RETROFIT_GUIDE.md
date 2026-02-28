# Retrofit Guide

## Objetivo
Aplicar o padrão do starter em projetos existentes sem quebra.

## Passos
1. Rodar audit e revisar relatório.
2. Priorizar itens `CRÍTICO` e `HIGH`.
3. Adicionar diretórios base ausentes.
4. Introduzir controles de qualidade e segurança.
5. Validar CI e lockfile.

## Migração de skills legadas (`skills/*.md`) para v2
1. Para cada skill legada `skills/<nome>.md`, criar pasta `skills/<nome>/`.
2. Mover conteúdo para `skills/<nome>/skill.md`.
3. Criar `skills/<nome>/meta.json` com schema v2.
4. Garantir `name` em kebab-case e único.
5. Definir `status` (`active` ou `deprecated`) conforme o ciclo de vida da skill.
6. Registrar `requires_docs` e `doc_sources` quando necessário.
7. Rodar `pnpm askit new:skill <nome-temporario> --path <projeto>` apenas como referência de scaffold, se necessário.
8. Atualizar/remover a skill legada antiga após validar o registry.

## Regra de colisão legacy vs v2
- Se houver legacy e v2 com o mesmo nome, o registry prioriza a v2.
- A entrada legacy não é duplicada no catálogo final.

## Referência operacional
- Para executar retrofit com consistência no dia a dia, seguir `docs/OPERATING_SYSTEM.md`.
