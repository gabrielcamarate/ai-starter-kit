import fs from "node:fs";
import path from "node:path";
import type { AuditFinding } from "../../types.js";

const REQUIRED_PATHS = [
  "agents/agent_rules.md",
  "controls/security.md",
  "controls/quality.md",
  "skills/README.md",
  "docs/QUICKSTART.md",
  "security/SECURITY_CHECKLIST.md"
];

export function checkStructure(targetPath: string): AuditFinding[] {
  const findings: AuditFinding[] = [];

  for (const item of REQUIRED_PATHS) {
    const full = path.join(targetPath, item);
    if (!fs.existsSync(full)) {
      findings.push({
        id: `missing-${item.replace(/[\/\.]/g, "-")}`,
        title: `Lacuna estrutural: ${item}`,
        severity: "MEDIUM",
        details: `Arquivo ou diretório obrigatório ausente: ${item}`,
        recommendation: `Adicionar ${item} conforme padrão do starter kit.`,
        file: item
      });
    }
  }

  return findings;
}
