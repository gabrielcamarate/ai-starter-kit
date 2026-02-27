import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { runInitCommand } from "../src/commands/init.js";

test("init cria projeto com estrutura base", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "askit-init-"));
  await runInitCommand("app-demo", { template: "react-ts", path: root, git: false, yes: false });

  const target = path.join(root, "app-demo");
  assert.equal(fs.existsSync(path.join(target, "agents", "agent_rules.md")), true);
  assert.equal(fs.existsSync(path.join(target, "security", "SECURITY_CHECKLIST.md")), true);
  assert.equal(fs.existsSync(path.join(target, "src", "main.tsx")), true);
});

test("init falha em diretório não vazio sem --yes", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "askit-init-non-empty-"));
  const target = path.join(root, "app-demo");
  fs.mkdirSync(target);
  fs.writeFileSync(path.join(target, "existing.txt"), "x", "utf-8");

  await assert.rejects(
    () => runInitCommand("app-demo", { template: "python", path: root, git: false, yes: false }),
    /não está vazio/
  );
});

test("init com --yes permite sobrescrita explícita", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "askit-init-overwrite-"));
  const target = path.join(root, "app-demo");
  fs.mkdirSync(path.join(target, "agents"), { recursive: true });
  fs.writeFileSync(path.join(target, "agents", "agent_rules.md"), "conteudo-antigo", "utf-8");

  await runInitCommand("app-demo", { template: "python", path: root, git: false, yes: true });

  const updated = fs.readFileSync(path.join(target, "agents", "agent_rules.md"), "utf-8");
  assert.match(updated, /Constituição de Agentes/);
});
