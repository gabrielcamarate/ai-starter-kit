import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();

function run(command, args, cwd) {
  const printable = [command, ...args].join(" ");
  console.log(`[smoke-templates] ${printable} (cwd=${cwd})`);
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    encoding: "utf-8"
  });
  if (result.status !== 0) {
    throw new Error(`[smoke-templates] comando falhou: ${printable}`);
  }
}

function hasPython() {
  const candidates = ["python3", "python"];
  for (const bin of candidates) {
    const result = spawnSync(bin, ["--version"], { stdio: "pipe", encoding: "utf-8" });
    if (result.status === 0) {
      return bin;
    }
  }
  return null;
}

function runReactSmoke(tempRoot) {
  const projectName = "smoke-react";
  const projectPath = path.join(tempRoot, projectName);
  run("pnpm", ["-C", "packages/cli", "dev", "init", projectName, "--template", "react-ts", "--path", tempRoot], repoRoot);

  run("pnpm", ["install"], projectPath);
  run("pnpm", ["build"], projectPath);
}

function runPythonSmoke(tempRoot) {
  const python = hasPython();
  if (!python) {
    throw new Error("[smoke-templates] python não encontrado no ambiente.");
  }

  const projectName = "smoke-python";
  const projectPath = path.join(tempRoot, projectName);
  run("pnpm", ["-C", "packages/cli", "dev", "init", projectName, "--template", "python", "--path", tempRoot], repoRoot);

  run(python, ["-m", "compileall", "-q", "src", "tests"], projectPath);
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "askit-smoke-"));
  console.log(`[smoke-templates] diretório temporário: ${tempRoot}`);

  try {
    runReactSmoke(tempRoot);
    runPythonSmoke(tempRoot);
    console.log("[smoke-templates] smoke test de templates concluído com sucesso.");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

main();
