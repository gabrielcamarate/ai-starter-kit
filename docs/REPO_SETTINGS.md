# GitHub Repo Settings (Obrigatórias)

Este documento define as configurações obrigatórias de governança do repositório `ai-starter-kit`.

## 1) Automatically delete head branches
- Objetivo: deletar automaticamente a branch de origem após merge do PR.
- Onde habilitar na UI:
  - `Settings` -> `General` -> seção `Pull Requests`
  - ativar `Automatically delete head branches`

## 2) Merge settings
- Política obrigatória:
  - `Allow squash merging`: **ON**
  - `Allow rebase merging`: **ON**
  - `Allow merge commits`: **OFF**

- Onde configurar na UI:
  - `Settings` -> `General` -> seção `Pull Requests`

## 3) Branch protection (main)
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

## 4) Pós-merge automático
Workflow: `.github/workflows/post-merge.yml`
- Trigger: `pull_request` com `closed` e `merged=true` na `main`.
- Ações:
  - comenta no PR: `Merged ✅`
  - faz checagem rápida de consistência (`validate-structure` e `validate-templates`)
  - registra verificação best-effort do tipo de merge
  - verifica best-effort se a head branch foi deletada
- Não altera código automaticamente.

## 5) Setup checklist do repositório
- [ ] `Automatically delete head branches` ativo.
- [ ] Merge settings conforme seção 2.
- [ ] Branch protection da `main` conforme seção 3.
- [ ] Workflow de pós-merge habilitado e executando após merge.

## 6) Comandos `gh` para aplicar por código
```bash
# Enable auto-delete head branches + merge policy
gh api -X PATCH repos/gabrielcamarate/ai-starter-kit \
  -H 'Accept: application/vnd.github+json' \
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
