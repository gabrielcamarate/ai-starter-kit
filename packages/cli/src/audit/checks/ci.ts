import fs from "node:fs";
import path from "node:path";
import type { AuditFinding } from "../../types.js";

export function checkCi(targetPath: string): AuditFinding[] {
  const workflowPath = path.join(targetPath, ".github", "workflows");
  if (fs.existsSync(workflowPath)) {
    return [];
  }

  return [
    {
      id: "missing-ci",
      title: "CI ausente",
      severity: "HIGH",
      details: "Sem pipeline de CI, regressões e falhas de segurança passam sem validação automática.",
      recommendation: "Adicionar workflow de CI com testes, lint, typecheck e scans de segurança.",
      file: ".github/workflows"
    }
  ];
}
