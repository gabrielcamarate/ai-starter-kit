import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { commandExists, run } from "../../utils/process.js";
import type { AuditFinding } from "../../types.js";

const TEXT_EXTENSIONS = new Set([
  ".md",
  ".txt",
  ".json",
  ".yaml",
  ".yml",
  ".env",
  ".ts",
  ".tsx",
  ".js",
  ".py",
  ".toml",
  ".ini"
]);

const SECRET_PATTERNS = [
  { regex: /ghp_[A-Za-z0-9]{30,}/g, name: "GitHub Token" },
  { regex: /sk-[A-Za-z0-9]{20,}/g, name: "API key estilo sk-" },
  { regex: /AKIA[0-9A-Z]{16}/g, name: "AWS Access Key" },
  { regex: /(secret|token|password)\s*[:=]\s*["'][^"']{8,}["']/gi, name: "Credencial hardcoded" }
];

function listFilesRecursive(basePath: string): string[] {
  const files: string[] = [];
  const stack: string[] = [basePath];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") {
        continue;
      }
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function runHeuristicSecretScan(targetPath: string): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const files = listFilesRecursive(targetPath);

  const envPath = path.join(targetPath, ".env");
  if (fs.existsSync(envPath)) {
    findings.push({
      id: "env-present",
      title: "Arquivo .env presente no projeto",
      severity: "HIGH",
      details: "Arquivo .env encontrado. Se versionado, há risco de exposição de segredo.",
      recommendation: "Garanta que .env está no .gitignore e use .env.example sem valores sensíveis.",
      file: ".env"
    });
  }

  for (const filePath of files) {
    const ext = path.extname(filePath).toLowerCase();
    if (!TEXT_EXTENSIONS.has(ext) && path.basename(filePath) !== ".env") {
      continue;
    }

    const stat = fs.statSync(filePath);
    if (stat.size > 1024 * 1024) {
      continue;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    for (const pattern of SECRET_PATTERNS) {
      const match = content.match(pattern.regex);
      if (!match) {
        continue;
      }
      findings.push({
        id: `secret-${pattern.name.toLowerCase().replace(/\s+/g, "-")}`,
        title: `Possível segredo exposto (${pattern.name})`,
        severity: "CRITICAL",
        details: `Padrão de segredo detectado heurísticamente em ${path.relative(targetPath, filePath)}.`,
        recommendation: "Revogar credencial, remover segredo do código e rotacionar chaves.",
        file: path.relative(targetPath, filePath)
      });
    }
  }

  return findings;
}

function runGitleaks(targetPath: string): AuditFinding[] {
  const findings: AuditFinding[] = [];
  if (!commandExists("gitleaks")) {
    return findings;
  }

  const reportPath = path.join(os.tmpdir(), `askit-gitleaks-${Date.now()}.json`);
  const result = run(
    "gitleaks",
    ["detect", "--no-git", "--source", targetPath, "--report-format", "json", "--report-path", reportPath],
    targetPath
  );

  if (fs.existsSync(reportPath)) {
    const reportRaw = fs.readFileSync(reportPath, "utf-8");
    fs.rmSync(reportPath, { force: true });
    if (reportRaw.trim().length > 0) {
      try {
        const parsed = JSON.parse(reportRaw) as Array<{ File?: string; Description?: string }>;
        if (parsed.length > 0) {
          findings.push({
            id: "gitleaks-detected",
            title: "CRÍTICO: possível segredo detectado por gitleaks",
            severity: "CRITICAL",
            details: `gitleaks encontrou ${parsed.length} possível(is) segredo(s).`,
            recommendation: "Revogar credenciais comprometidas e limpar histórico com procedimento seguro.",
            file: parsed[0]?.File
          });
        }
      } catch {
        findings.push({
          id: "gitleaks-parse-error",
          title: "Limitação na análise do gitleaks",
          severity: "MEDIUM",
          details: "gitleaks executou, mas o relatório não pôde ser interpretado.",
          recommendation: "Executar gitleaks manualmente e revisar output bruto."
        });
      }
    }
  }

  if (result.code > 1) {
    findings.push({
      id: "gitleaks-execution-error",
      title: "Limitação na execução do gitleaks",
      severity: "MEDIUM",
      details: result.stderr.trim() || "Falha desconhecida ao executar gitleaks.",
      recommendation: "Instalar/atualizar gitleaks para aumentar cobertura local."
    });
  }

  return findings;
}

export function checkSecrets(targetPath: string): { findings: AuditFinding[]; limitation?: string } {
  const findings = runHeuristicSecretScan(targetPath);
  const gitleaksFindings = runGitleaks(targetPath);
  findings.push(...gitleaksFindings);

  if (!commandExists("gitleaks")) {
    return {
      findings,
      limitation: "gitleaks não encontrado localmente; análise de segredos limitada a heurísticas internas."
    };
  }

  return { findings };
}
