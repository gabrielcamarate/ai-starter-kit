import fs from "node:fs";
import path from "node:path";
import { runAuditChecks } from "../audit/index.js";
import { buildMarkdown, toReport } from "../audit/report.js";
import { ensureDirectoryOrThrow } from "../utils/fs.js";
import { logInfo } from "../utils/log.js";
import type { AuditOptions } from "../types.js";

export async function runAuditCommand(options: AuditOptions): Promise<void> {
  const targetPath = options.path ? path.resolve(options.path) : process.cwd();
  ensureDirectoryOrThrow(targetPath);

  const outputFile = options.out ? path.resolve(options.out) : path.join(targetPath, "AUDIT_REPORT.md");
  const { findings, limitations } = runAuditChecks(targetPath);
  const report = toReport(targetPath, findings, limitations);
  const markdown = buildMarkdown(report);

  fs.writeFileSync(outputFile, markdown, "utf-8");
  logInfo(`Audit concluído. Relatório: ${outputFile}`);
}
