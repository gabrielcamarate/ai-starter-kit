import fs from "node:fs";
import path from "node:path";
import type { AuditFinding } from "../../types.js";

const REQUIRED_PATHS: Array<{ path: string; severity: "HIGH" | "MEDIUM" }> = [
  { path: "agents/agent_rules.md", severity: "MEDIUM" },
  { path: "controls/security.md", severity: "MEDIUM" },
  { path: "controls/quality.md", severity: "MEDIUM" },
  { path: "controls/doc_first.md", severity: "HIGH" },
  { path: "skills/README.md", severity: "MEDIUM" },
  { path: "skills/registry.json", severity: "HIGH" },
  { path: "docs/QUICKSTART.md", severity: "MEDIUM" },
  { path: "security/SECURITY_CHECKLIST.md", severity: "MEDIUM" }
];

export function checkStructure(targetPath: string): AuditFinding[] {
  const findings: AuditFinding[] = [];

  for (const item of REQUIRED_PATHS) {
    const full = path.join(targetPath, item.path);
    if (!fs.existsSync(full)) {
      findings.push({
        id: `missing-${item.path.replace(/[\/\.]/g, "-")}`,
        title: `Lacuna estrutural: ${item.path}`,
        severity: item.severity,
        details: `Arquivo ou diretório obrigatório ausente: ${item.path}`,
        recommendation: `Adicionar ${item.path} conforme padrão do starter kit.`,
        file: item.path
      });
    }
  }

  return findings;
}
