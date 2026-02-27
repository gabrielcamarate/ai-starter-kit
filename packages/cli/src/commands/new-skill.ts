import fs from "node:fs";
import path from "node:path";
import { SCAFFOLDS_PATH } from "../constants.js";
import { writeFileExclusive } from "../utils/fs.js";
import { logInfo } from "../utils/log.js";
import { normalizeSkillName, writeSkillRegistry } from "../skills/registry.js";
import type { GeneratorOptions } from "../types.js";

export async function runNewSkillCommand(name: string, options: GeneratorOptions): Promise<void> {
  const safeName = normalizeSkillName(name);
  const root = options.path ? path.resolve(options.path) : process.cwd();
  const skillsRoot = path.join(root, "skills");
  const legacyPath = path.join(skillsRoot, `${safeName}.md`);
  const skillDir = path.join(skillsRoot, safeName);
  const skillTarget = path.join(skillDir, "skill.md");
  const metaTarget = path.join(skillDir, "meta.json");

  if (fs.existsSync(skillDir)) {
    throw new Error(`Skill já existe: ${path.join("skills", safeName)}.`);
  }

  if (fs.existsSync(legacyPath)) {
    logInfo(
      `Skill legacy existente em ${path.join(
        "skills",
        `${safeName}.md`
      )}; nova skill v2 será criada e terá precedência no registry.`
    );
  }

  const skillScaffold = fs.readFileSync(path.join(SCAFFOLDS_PATH, "skill.md"), "utf-8");
  const metaScaffold = fs.readFileSync(path.join(SCAFFOLDS_PATH, "skill.meta.json"), "utf-8");

  const skillContent = skillScaffold.replaceAll("{{name}}", safeName);
  const metaContent = metaScaffold.replaceAll("{{name}}", safeName);

  writeFileExclusive(skillTarget, skillContent);
  writeFileExclusive(metaTarget, metaContent);
  writeSkillRegistry(root);

  logInfo(`Skill criada: ${skillTarget}`);
  logInfo(`Metadata criada: ${metaTarget}`);
  logInfo(`Registry atualizado: ${path.join(skillsRoot, "registry.json")}`);
}
