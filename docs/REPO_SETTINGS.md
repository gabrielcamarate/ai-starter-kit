# GitHub Repo Settings (Obrigatórias)

Este documento define as configurações obrigatórias de governança do repositório `ai-starter-kit`.

## 1) Allow auto-merge
- Objetivo: permitir que PRs com checks/regras atendidos sejam mergeados automaticamente.
- Onde habilitar na UI:
  - `Settings` -> `General` -> seção `Pull Requests`
  - ativar `Allow auto-merge`

## 2) Automatically delete head branches
- Objetivo: deletar automaticamente a branch de origem após merge do PR.
- Onde habilitar na UI:
  - `Settings` -> `General` -> seção `Pull Requests`
  - ativar `Automatically delete head branches`

## 3) Merge settings
- Política obrigatória:
  - `Allow squash merging`: **ON**
  - `Allow rebase merging`: **ON**
  - `Allow merge commits`: **OFF**

- Onde configurar na UI:
  - `Settings` -> `General` -> seção `Pull Requests`

## 4) Branch protection (main)
Expectativas mínimas para `main`:
- Pull request obrigatório para merge.
- Required status checks com `build-test-security` e `strict=true`.
- `require_code_owner_reviews=true`.
- `required_approving_review_count=0` (modo solo).
- `enforce_admins=true`.
- `required_linear_history=true`.
- `allow_force_pushes=false`.
- `allow_deletions=false`.

- Onde configurar na UI:
  - `Settings` -> `Rules` -> `Rulesets` (ou `Branches` em repositórios legados)

## 5) Pós-merge automático
Workflow: `.github/workflows/post-merge.yml`
- Trigger: `pull_request` com `closed` e `merged=true` na `main`.
- Ações:
  - comenta no PR: `Merged successfully ✅`
  - registra em log se a head branch foi removida
- Não altera código automaticamente.

## 6) Setup checklist do repositório
- [ ] `Allow auto-merge` ativo.
- [ ] `Automatically delete head branches` ativo.
- [ ] Merge settings conforme seção 3.
- [ ] Branch protection da `main` conforme seção 4.
- [ ] Workflow de pós-merge habilitado e executando após merge.

## 7) Comandos `gh` para aplicar por código
```bash
# Enable auto-merge + auto-delete head branches + merge policy
gh api -X PATCH repos/gabrielcamarate/ai-starter-kit \
  -H 'Accept: application/vnd.github+json' \
  -f allow_auto_merge=true \
  -f delete_branch_on_merge=true \
  -f allow_squash_merge=true \
  -f allow_rebase_merge=true \
  -f allow_merge_commit=false

# Apply branch protection (solo mode)
cat <<'JSON' > /tmp/main-protection-solo.json
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["build-test-security"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 0
  },
  "restrictions": null,
  "required_conversation_resolution": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_linear_history": true
}
JSON

gh api -X PUT repos/gabrielcamarate/ai-starter-kit/branches/main/protection \
  -H 'Accept: application/vnd.github+json' \
  --input /tmp/main-protection-solo.json
```
