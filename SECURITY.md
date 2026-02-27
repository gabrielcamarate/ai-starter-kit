# Security Policy

## Objetivo
Estabelecer práticas mínimas de segurança para este starter kit e para projetos gerados.

## Scanners obrigatórios no CI
- `gitleaks`: detecta segredos em código e histórico.
- `osv-scanner`: detecta vulnerabilidades conhecidas em dependências.

A pipeline falha se:
- houver segredos detectados
- houver vulnerabilidade crítica detectada

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
