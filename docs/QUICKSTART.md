# Quickstart (5 minutos)

## 1) Instalar dependências
```bash
pnpm install
```

## 2) Ver ajuda
```bash
pnpm askit --help
```

## 3) Criar projeto
```bash
pnpm askit init meu-projeto --template react-ts
```

## 4) Criar skill no formato v2
```bash
pnpm askit new:skill revisar-pr --path ./meu-projeto
```

O comando cria:
- `skills/revisar-pr/skill.md`
- `skills/revisar-pr/meta.json`
- atualização automática de `skills/registry.json`

## 5) Auditar projeto
```bash
pnpm askit audit --path ./meu-projeto
```

## 6) Fluxo Doc-first
- Antes de codar com API/lib nova, consulte `skills/registry.json`.
- Se a skill tiver `requires_docs=true`, registre:
  - Sources
  - Key constraints
  - Version (quando aplicável)

## 7) Governança do repositório GitHub
Consulte `docs/REPO_SETTINGS.md` para regras obrigatórias de proteção da `main`, política de merge e automações pós-merge.

## 8) Smoke test de automação pós-merge
Este repositório possui fluxo automático de merge + pós-merge no GitHub.
