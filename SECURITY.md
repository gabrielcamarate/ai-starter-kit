# Security Policy

## Objetivo
Estabelecer práticas mínimas de segurança para este starter kit e para projetos gerados.

## Scanners obrigatórios no CI
- `gitleaks`: detecta segredos em código e histórico.
- `osv-scanner`: detecta vulnerabilidades conhecidas em dependências.

A pipeline falha se:
- houver segredos detectados
- houver vulnerabilidade crítica detectada

## Governança de merge e proteção da branch
- `main` deve usar histórico linear obrigatório para evitar merge commits não lineares.
- Revisão de CODEOWNERS deve ser obrigatória para qualquer alteração no repositório.
- Política de merge:
  - permitir `squash merge`
  - permitir `rebase merge`
  - bloquear `merge commit`

Essas regras reduzem risco de bypass de revisão, simplificam auditoria de histórico e facilitam rollback seguro.

## Verificação local opcional
- `pnpm askit audit --path <projeto>` tenta usar `gitleaks` e `osv-scanner` quando disponíveis.
- Se as ferramentas não estiverem instaladas, o relatório indica limitação da varredura local e aplica heurísticas.
- Scripts opcionais:
  - `pnpm scan:secrets`
  - `pnpm scan:osv`

## Práticas mínimas
- Não versionar `.env` com segredos.
- Revisar logs para evitar exposição de dados sensíveis.
- Evitar execução de scripts inseguros (`curl|bash`, `wget|bash`, `eval`).
- Manter lockfile e CI ativos.
