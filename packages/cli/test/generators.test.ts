import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { runNewAgentCommand } from "../src/commands/new-agent.js";
import { runNewControlCommand } from "../src/commands/new-control.js";
import { runNewSkillCommand } from "../src/commands/new-skill.js";
import { writeSkillRegistry } from "../src/skills/registry.js";

test("new:* gera artefatos e atualiza registry para skill v2", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "askit-gen-"));
  fs.mkdirSync(path.join(root, "skills"), { recursive: true });
  fs.mkdirSync(path.join(root, "agents"), { recursive: true });
  fs.mkdirSync(path.join(root, "controls"), { recursive: true });

  await runNewSkillCommand("Minha Skill", { path: root });
  await runNewAgentCommand("Meu Agent", { path: root });
  await runNewControlCommand("Meu Control", { path: root });

  assert.equal(fs.existsSync(path.join(root, "skills", "minha-skill", "skill.md")), true);
  assert.equal(fs.existsSync(path.join(root, "skills", "minha-skill", "meta.json")), true);
  assert.equal(fs.existsSync(path.join(root, "agents", "meu-agent.md")), true);
  assert.equal(fs.existsSync(path.join(root, "controls", "meu-control.md")), true);

  const registryPath = path.join(root, "skills", "registry.json");
  assert.equal(fs.existsSync(registryPath), true);
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8")) as { skills: Array<{ name: string }> };
  assert.deepEqual(registry.skills.map((item) => item.name), ["minha-skill"]);
});

test("registry mantém ordem determinística por nome", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "askit-registry-order-"));
  fs.mkdirSync(path.join(root, "skills"), { recursive: true });

  await runNewSkillCommand("zeta-skill", { path: root });
  await runNewSkillCommand("alpha-skill", { path: root });

  const registryPath = path.join(root, "skills", "registry.json");
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8")) as { skills: Array<{ name: string }> };
  assert.deepEqual(registry.skills.map((item) => item.name), ["alpha-skill", "zeta-skill"]);

  const before = fs.readFileSync(registryPath, "utf-8");
  writeSkillRegistry(root);
  const after = fs.readFileSync(registryPath, "utf-8");
  assert.equal(after, before);
});

test("colisão legacy vs v2 mantém entrada canônica v2 única", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "askit-registry-collision-"));
  fs.mkdirSync(path.join(root, "skills"), { recursive: true });
  fs.writeFileSync(path.join(root, "skills", "doc-first.md"), "# legacy", "utf-8");

  await runNewSkillCommand("doc-first", { path: root });

  const registryPath = path.join(root, "skills", "registry.json");
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8")) as {
    skills: Array<{ name: string; format: string; path: string }>;
  };
  assert.equal(registry.skills.length, 1);
  assert.equal(registry.skills[0]?.name, "doc-first");
  assert.equal(registry.skills[0]?.format, "v2");
  assert.equal(registry.skills[0]?.path, "skills/doc-first/skill.md");
});

test("falha ao processar meta.json inválido", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "askit-invalid-meta-"));
  const skillDir = path.join(root, "skills", "broken-skill");
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(path.join(skillDir, "skill.md"), "# broken", "utf-8");
  fs.writeFileSync(
    path.join(skillDir, "meta.json"),
    JSON.stringify(
      {
        name: "broken-skill",
        version: "",
        status: "active",
        tags: [],
        requires_docs: false,
        doc_sources: [],
        inputs: [],
        outputs: []
      },
      null,
      2
    ),
    "utf-8"
  );

  assert.throws(() => writeSkillRegistry(root), /version/);
});
