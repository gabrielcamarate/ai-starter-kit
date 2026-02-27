import fs from "node:fs";
import path from "node:path";
import type { AuditFinding } from "../../types.js";

const LOCKFILES = ["pnpm-lock.yaml", "package-lock.json", "yarn.lock", "poetry.lock", "Pipfile.lock"];

export function checkLockfile(targetPath: string): AuditFinding[] {
  const hasLockfile = LOCKFILES.some((lockfile) => fs.existsSync(path.join(targetPath, lockfile)));
  if (hasLockfile) {
    return [];
  }

  return [
    {
      id: "missing-lockfile",
      title: "Lockfile ausente",
      severity: "HIGH",
      details: "Sem lockfile, builds podem ficar não determinísticos entre ambientes.",
      recommendation: "Gerar e versionar lockfile do gerenciador de pacotes em uso."
    }
  ];
}
