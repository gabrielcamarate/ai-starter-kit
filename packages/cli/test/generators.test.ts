import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { runNewAgentCommand } from "../src/commands/new-agent.js";
import { runNewControlCommand } from "../src/commands/new-control.js";
import { runNewSkillCommand } from "../src/commands/new-skill.js";

test("new:* gera arquivos nos diretórios corretos", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "askit-gen-"));
  fs.mkdirSync(path.join(root, "skills"), { recursive: true });
  fs.mkdirSync(path.join(root, "agents"), { recursive: true });
  fs.mkdirSync(path.join(root, "controls"), { recursive: true });

  await runNewSkillCommand("Minha Skill", { path: root });
  await runNewAgentCommand("Meu Agent", { path: root });
  await runNewControlCommand("Meu Control", { path: root });

  assert.equal(fs.existsSync(path.join(root, "skills", "minha-skill.md")), true);
  assert.equal(fs.existsSync(path.join(root, "agents", "meu-agent.md")), true);
  assert.equal(fs.existsSync(path.join(root, "controls", "meu-control.md")), true);
});
