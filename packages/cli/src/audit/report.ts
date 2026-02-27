import path from "node:path";
import type { AuditFinding, AuditReport, AuditSeverity } from "../types.js";

const order: Record<AuditSeverity, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3
};

function summarize(findings: AuditFinding[]): Record<AuditSeverity, number> {
  return findings.reduce(
    (acc, item) => {
      acc[item.severity] += 1;
      return acc;
    },
    { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
  );
}

export function buildMarkdown(report: AuditReport): string {
  const findings = [...report.findings].sort((a, b) => order[a.severity] - order[b.severity]);
  const summary = summarize(findings);

  const lines: string[] = [];
  lines.push("# AUDIT REPORT");
  lines.push("");
  lines.push(`- Alvo: \`${report.targetPath}\``);
  lines.push(`- Gerado em: ${report.generatedAt}`);
  lines.push("");
  lines.push("## Resumo");
  lines.push(`- CRÍTICO: ${summary.CRITICAL}`);
  lines.push(`- HIGH: ${summary.HIGH}`);
  lines.push(`- MEDIUM: ${summary.MEDIUM}`);
  lines.push(`- LOW: ${summary.LOW}`);
  lines.push("");

  if (report.limitations.length > 0) {
    lines.push("## Limitações da varredura local");
    for (const limitation of report.limitations) {
      lines.push(`- ${limitation}`);
    }
    lines.push("");
  }

  lines.push("## Lacunas e riscos");
  if (findings.length === 0) {
    lines.push("- Nenhuma lacuna crítica encontrada contra o padrão mínimo.");
  } else {
    for (const finding of findings) {
      const file = finding.file ? ` (arquivo: ${finding.file})` : "";
      const label = finding.severity === "CRITICAL" ? "CRÍTICO" : finding.severity;
      lines.push(`### ${label} - ${finding.title}${file}`);
      lines.push(`- Detalhe: ${finding.details}`);
      lines.push(`- Recomendação: ${finding.recommendation}`);
      lines.push("");
    }
  }

  lines.push("## Plano incremental de retrofit");
  lines.push("1. Corrigir imediatamente todos os itens CRÍTICO e HIGH.");
  lines.push("2. Preencher lacunas estruturais (agents/controls/skills/docs/security)." );
  lines.push("3. Garantir lockfile, .gitignore e CI ativo." );
  lines.push("4. Reexecutar audit após cada etapa para validar progresso." );

  return `${lines.join("\n").trim()}\n`;
}

export function toReport(targetPath: string, findings: AuditFinding[], limitations: string[]): AuditReport {
  return {
    targetPath: path.resolve(targetPath),
    generatedAt: new Date().toISOString(),
    findings,
    limitations
  };
}
