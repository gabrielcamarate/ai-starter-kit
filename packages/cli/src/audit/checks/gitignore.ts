import fs from "node:fs";
import path from "node:path";
import type { AuditFinding } from "../../types.js";

export function checkGitignore(targetPath: string): AuditFinding[] {
  const gitignorePath = path.join(targetPath, ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    return [];
  }

  return [
    {
      id: "missing-gitignore",
      title: "Ausência de .gitignore",
      severity: "HIGH",
      details: "Projeto sem .gitignore aumenta risco de versionar segredos, binários e caches.",
      recommendation: "Adicionar .gitignore mínimo incluindo .env, node_modules e diretórios de build.",
      file: ".gitignore"
    }
  ];
}
