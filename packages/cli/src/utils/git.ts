import path from "node:path";
import { logInfo } from "./log.js";
import { run } from "./process.js";

function ensureGitSuccess(code: number, stderr: string, context: string): void {
  if (code !== 0) {
    throw new Error(`${context}: ${stderr.trim() || "erro desconhecido"}`);
  }
}

function addExplicitFiles(cwd: string, files: string[]): void {
  if (files.length === 0) {
    return;
  }

  const relative = files
    .map((file) => path.relative(cwd, file))
    .filter((file) => file.length > 0)
    .sort();

  const result = run("git", ["add", "--", ...relative], cwd);
  ensureGitSuccess(result.code, result.stderr, "Falha em git add com lista explícita");
}

function commitWithMessage(cwd: string, subject: string, changed: string, reason: string): void {
  const result = run("git", ["commit", "-m", subject, "-m", changed, "-m", reason], cwd);
  ensureGitSuccess(result.code, result.stderr, "Falha ao criar commit");
}

export function runGitInitWithTwoCommits(input: {
  cwd: string;
  projectName: string;
  template: string;
  baseFiles: string[];
  templateFiles: string[];
}): void {
  const initResult = run("git", ["init"], input.cwd);
  ensureGitSuccess(initResult.code, initResult.stderr, "Falha no git init");

  addExplicitFiles(input.cwd, input.baseFiles);
  commitWithMessage(
    input.cwd,
    `feat: bootstrap project ${input.projectName} with ai-starter-kit baseline`,
    "What changed: added the base structure (agents/controls/skills/docs/security), policies, and governance files.",
    "Why: establish a consistent and secure baseline for all projects."
  );

  addExplicitFiles(input.cwd, input.templateFiles);
  commitWithMessage(
    input.cwd,
    `feat: apply ${input.template} template to project ${input.projectName}`,
    `What changed: added ${input.template} stack files and minimum development/quality scripts.`,
    "Why: enable a fast start with a consistent and functional stack."
  );

  logInfo("Repositório git inicializado com 2 commits descritivos.");
}
