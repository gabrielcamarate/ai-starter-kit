# Publicar no GitHub

## 1) Inicializar git local
```bash
git init
```

## 2) Adicionar arquivos explicitamente (sem `git add .`)
```bash
git add DESIGN.md package.json pnpm-workspace.yaml tsconfig.base.json .gitignore README.md LICENSE CONTRIBUTING.md SECURITY.md GITHUB_PUBLISH.md
```
```bash
git add .github/CODEOWNERS .github/pull_request_template.md .github/workflows/ci.yml agents controls docs security skills scripts packages
```

## 3) Criar commit semântico descritivo
```bash
cat > /tmp/commit-message.txt <<'EOF'
feat: create ai-starter-kit baseline with pnpm monorepo and CLI

What changed:
- added the full starter structure, templates, CLI commands, and CI with security checks.

Why:
- standardize bootstrap and retrofit workflows with deterministic local execution.
EOF

git commit -F /tmp/commit-message.txt
```

## 4) Criar repositório remoto e enviar
```bash
git branch -M main
git remote add origin git@github.com:<seu-usuario>/ai-starter-kit.git
git push -u origin main
```

## 5) Abrir PR com body em arquivo (sem `\\n` literal)
```bash
cat > /tmp/pr-body.md <<'EOF'
What changed:
- describe objective changes with real bullets.

Why:
- explain rationale and impact.
EOF

gh pr create \
  --base main \
  --head <sua-branch> \
  --title "docs: update branch governance rules" \
  --body-file /tmp/pr-body.md
```
