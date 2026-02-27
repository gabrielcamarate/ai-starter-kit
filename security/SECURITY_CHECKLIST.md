# Security Checklist Pré-Deploy

- [ ] Segredos removidos do repositório.
- [ ] `.env` protegido por `.gitignore`.
- [ ] Dependências auditadas (`osv-scanner`).
- [ ] Scan de segredos (`gitleaks`) sem findings.
- [ ] Logs sem dados sensíveis.
- [ ] Scripts perigosos revisados.
- [ ] CI ativo e obrigatório para merge.
