import fs from "node:fs";
import path from "node:path";
import type { AuditFinding } from "../../types.js";

const INSECURE_PATTERNS = ["curl ", "wget ", "| bash", "| sh", "eval(", "rm -rf /"];

export function checkInsecureScripts(targetPath: string): AuditFinding[] {
  const packageJsonPath = path.join(targetPath, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    return [];
  }

  const raw = fs.readFileSync(packageJsonPath, "utf-8");
  const parsed = JSON.parse(raw) as { scripts?: Record<string, string> };
  if (!parsed.scripts) {
    return [];
  }

  const findings: AuditFinding[] = [];

  for (const [name, script] of Object.entries(parsed.scripts)) {
    const lower = script.toLowerCase();
    const matched = INSECURE_PATTERNS.find((pattern) => lower.includes(pattern));
    if (!matched) {
      continue;
    }
    findings.push({
      id: `insecure-script-${name}`,
      title: `Script potencialmente inseguro: ${name}`,
      severity: "HIGH",
      details: `Script contém padrão perigoso (${matched}): ${script}`,
      recommendation: "Remover execução remota direta e validar comandos sensíveis.",
      file: "package.json"
    });
  }

  return findings;
}
