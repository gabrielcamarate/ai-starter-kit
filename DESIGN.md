# DESIGN.md — ai-starter-kit

## 1) Objetivo do repositório
O `ai-starter-kit` é um monorepo local-first para padronizar a criação de novos projetos e o retrofit de projetos existentes com governança mínima (agents/controls/skills/docs/security), segurança prática e automação reprodutível via CLI em Node.js + TypeScript, reduzindo improviso estrutural e garantindo consistência de qualidade entre stacks.

## 2) Estrutura de diretórios proposta (árvore oficial)
```text
ai-starter-kit/
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ agents/
│  ├─ README.md
│  └─ agent_rules.md
├─ controls/
│  ├─ quality.md
│  └─ security.md
├─ docs/
│  ├─ QUICKSTART.md
│  ├─ RETROFIT_GUIDE.md
│  └─ TEMPLATES_GUIDE.md
├─ security/
│  ├─ SECURITY_CHECKLIST.md
│  └─ THREAT_MODEL_TEMPLATE.md
├─ skills/
│  ├─ README.md
│  ├─ examples/
│  │  ├─ agent-example.md
│  │  └─ skill-example.md
│  └─ templates/
│     ├─ agent.template.md
│     ├─ control.template.md
│     └─ skill.template.md
├─ scripts/
│  ├─ validate-structure.mjs
│  └─ validate-templates.mjs
├─ packages/
│  ├─ cli/
│  │  ├─ package.json
│  │  ├─ tsconfig.json
│  │  ├─ src/
│  │  │  ├─ constants.ts
│  │  │  ├─ index.ts
│  │  │  ├─ types.ts
│  │  │  ├─ audit/
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ report.ts
│  │  │  │  └─ checks/
│  │  │  │     ├─ ci.ts
│  │  │  │     ├─ gitignore.ts
│  │  │  │     ├─ lockfile.ts
│  │  │  │     ├─ scripts.ts
│  │  │  │     ├─ secrets.ts
│  │  │  │     └─ structure.ts
│  │  │  ├─ commands/
│  │  │  │  ├─ audit.ts
│  │  │  │  ├─ init.ts
│  │  │  │  ├─ new-agent.ts
│  │  │  │  ├─ new-control.ts
│  │  │  │  └─ new-skill.ts
│  │  │  ├─ template/
│  │  │  │  ├─ catalog.ts
│  │  │  │  └─ copy.ts
│  │  │  └─ utils/
│  │  │     ├─ fs.ts
│  │  │     ├─ git.ts
│  │  │     ├─ log.ts
│  │  │     └─ process.ts
│  │  └─ test/
│  │     ├─ audit.test.ts
│  │     ├─ generators.test.ts
│  │     ├─ git-policy.test.ts
│  │     └─ init.test.ts
│  └─ templates/
│     ├─ package.json
│     ├─ catalog.json
│     ├─ base/
│     │  ├─ agents/
│     │  │  ├─ README.md
│     │  │  └─ agent_rules.md
│     │  ├─ controls/
│     │  │  ├─ quality.md
│     │  │  └─ security.md
│     │  ├─ docs/
│     │  │  ├─ QUICKSTART.md
│     │  │  ├─ RETROFIT_GUIDE.md
│     │  │  └─ TEMPLATES_GUIDE.md
│     │  ├─ security/
│     │  │  ├─ SECURITY_CHECKLIST.md
│     │  │  └─ THREAT_MODEL_TEMPLATE.md
│     │  └─ skills/
│     │     ├─ README.md
│     │     ├─ examples/
│     │     │  ├─ agent-example.md
│     │     │  └─ skill-example.md
│     │     └─ templates/
│     │        ├─ agent.template.md
│     │        ├─ control.template.md
│     │        └─ skill.template.md
│     ├─ project-templates/
│     │  ├─ react-ts/
│     │  │  ├─ README.md
│     │  │  └─ template/
│     │  │     ├─ .gitignore
│     │  │     ├─ index.html
│     │  │     ├─ package.json
│     │  │     ├─ tsconfig.json
│     │  │     ├─ vite.config.ts
│     │  │     └─ src/
│     │  │        ├─ App.tsx
│     │  │        ├─ main.tsx
│     │  │        └─ smoke.test.ts
│     │  └─ python/
│     │     ├─ README.md
│     │     └─ template/
│     │        ├─ .gitignore
│     │        ├─ pyproject.toml
│     │        ├─ src/
│     │        │  └─ app/
│     │        │     └─ __init__.py
│     │        └─ tests/
│     │           └─ test_smoke.py
│     └─ scaffolds/
│        ├─ agent.md
│        ├─ control.md
│        └─ skill.md
├─ .gitignore
├─ CONTRIBUTING.md
├─ DESIGN.md
├─ GITHUB_PUBLISH.md
├─ LICENSE
├─ README.md
├─ SECURITY.md
├─ package.json
├─ pnpm-workspace.yaml
└─ tsconfig.base.json
```

## 3) Arquitetura do monorepo (workspaces)
- Workspace `packages/cli`: CLI `askit`, responsável por bootstrap, geração de artefatos e auditoria de retrofit.
- Workspace `packages/templates`: catálogo versionado de base organizacional, templates de projeto e scaffolds de geração.
- Raiz: documentação, políticas, workflow de CI e scripts de validação estrutural.

`pnpm-workspace.yaml`
- Inclui apenas `packages/*`.

## 4) Especificação do CLI
Nome do comando: `askit`.

Execução:
- Desenvolvimento: `pnpm -C packages/cli dev <cmd> ...`
- Atalho na raiz: `pnpm askit <cmd> ...`

### 4.1 Comandos
1. `init <project-name> [--template react-ts|python] [--path <dir>] [--git] [--yes]`
   - Cria projeto novo com base padrão (`agents/controls/skills/docs/security`) + template da stack.
   - Default de template: `react-ts`.
   - `--path` define diretório pai de saída.
   - `--git` inicializa git local e cria 2 commits descritivos sem `git add .`.
   - `--yes` confirma explicitamente sobrescrita em diretório existente não-vazio (idempotência controlada).
2. `new:skill <name> [--path <project-dir>]`
   - Gera arquivo de skill a partir do scaffold oficial.
3. `new:agent <name> [--path <project-dir>]`
   - Gera arquivo de agente a partir do scaffold oficial.
4. `new:control <name> [--path <project-dir>]`
   - Gera arquivo de control a partir do scaffold oficial.
5. `audit [--path <project-dir>] [--out <file>]`
   - Não altera o projeto auditado.
   - Gera relatório Markdown (default `AUDIT_REPORT.md`) com lacunas, riscos e recomendações incrementais.
   - Riscos críticos são marcados como `CRÍTICO`.

### 4.2 Validação e erros
- Todos os comandos validam argumentos obrigatórios e valores permitidos.
- Em argumento inválido ou erro crítico: saída com código `1`.
- Não continuar execução após erro crítico.

### 4.3 Exemplos
- `pnpm askit init meu-app --template react-ts --path ./projects`
- `pnpm askit init meu-servico --template python --git`
- `pnpm askit new:skill review-pr --path ./meu-app`
- `pnpm askit new:agent guardiao-seguranca --path ./meu-app`
- `pnpm askit new:control dados-sensiveis --path ./meu-app`
- `pnpm askit audit --path ./meu-app --out RELATORIO.md`

## 5) Definição clara de Bootstrap vs Audit/Retrofit
- Bootstrap: criação de projeto novo já conforme padrão, com base organizacional e template técnico escolhido.
- Audit/Retrofit: inspeção de projeto existente para apontar lacunas e riscos sem alteração automática, permitindo adoção incremental e segura do padrão.

## 6) Política de segurança mínima (obrigatória)
- Secrets scanning:
  - CI: `gitleaks` obrigatório.
  - Local (audit): tentativa opcional de execução de `gitleaks` se instalado, com fallback heurístico.
- Dependências vulneráveis:
  - CI: `osv-scanner` obrigatório.
  - Local (audit): tentativa opcional de `osv-scanner` se instalado, com fallback heurístico/documentado.
- Práticas mínimas documentadas:
  - Não versionar `.env` com segredos.
  - Exigir `.gitignore` e lockfile.
  - Evitar scripts perigosos (`curl|bash`, `wget|bash`, `eval`, etc.).
  - Logging sem dados sensíveis.

## 7) Definition of Done (DoD)
1. Estrutura final corresponde exatamente à árvore oficial deste documento.
2. `DESIGN.md` lista explicitamente todos os artefatos obrigatórios.
3. CLI implementado com comandos `init`, `new:*`, `audit`.
4. `init` respeita idempotência (não sobrescreve sem confirmação explícita).
5. `audit` não modifica alvo além do relatório.
6. CI executa install, lint, typecheck, build, test, validações estruturais, gitleaks e osv-scanner.
7. Templates `react-ts` e `python` presentes e copiáveis pelo CLI.
8. Documentação completa para uso local, retrofit e publicação no GitHub.

## 8) Dependências com justificativa
Dependências de `packages/cli`:
- `commander`: parsing de CLI robusto e previsível.
- `typescript`: compilação e tipagem estática.
- `tsx`: execução TypeScript em desenvolvimento sem build manual.
- `@types/node`: tipagens oficiais para APIs Node.

Sem dependências adicionais no monorepo além das acima.

## 9) Matriz explícita de artefatos obrigatórios
Todos os arquivos e diretórios da árvore da seção 2 são obrigatórios e devem existir após implementação.

## 10) Determinismo e bloqueio de deriva estrutural
- Nenhum arquivo pode ser criado implicitamente fora da árvore oficial.
- Nenhum diretório adicional pode ser criado fora da árvore oficial.
- Nenhuma dependência extra pode ser adicionada sem atualização prévia deste `DESIGN.md` com justificativa.
- A validação automática (`scripts/validate-structure.mjs`) falha caso haja falta ou excesso de artefatos previstos.

## 11) Política obrigatória de commits
1. Nunca usar `git add .`.
2. Sempre adicionar arquivos explicitamente.
3. Prefixos semânticos permitidos: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`.
4. Todos os commits devem ser escritos em inglês.
5. O corpo do commit deve conter obrigatoriamente:
   - `What changed:`
   - `Why:`
6. Não utilizar mensagens bilíngues.
7. Não duplicar mensagens em português.
8. Mensagens genéricas proibidas: `update`, `fix bug`, `changes`.
9. Em `init --git`, criar 2 commits organizados e descritivos.
10. O CLI nunca gera commits automáticos genéricos.

## 12) Extensões futuras documentadas (não implementar agora)
- Qualidade de commits:
  - Preparar para futura adoção de `commitlint` + `husky` (somente documentação, sem instalação).
- Evolução de UX do CLI:
  - Possível suporte futuro a `init --dry-run` para pré-visualização de ações sem escrita em disco.

## 13) CI obrigatório
`ci.yml` deve executar:
1. `pnpm install` com cache.
2. `lint`, `typecheck`, `build`, `test` de `packages/cli`.
3. `node scripts/validate-templates.mjs`.
4. `node scripts/validate-structure.mjs`.
5. Scan com `gitleaks`.
6. Scan com `osv-scanner` e falha em vulnerabilidade crítica.

## 14) Política anti-improviso
- Nada “mágico”.
- Tudo documentado e repetível.
- Logs claros no CLI com prefixo `[askit]`.
