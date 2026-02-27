import fs from "node:fs";
import path from "node:path";
import { SCAFFOLDS_PATH } from "../constants.js";
import { writeFileExclusive } from "../utils/fs.js";
import { logInfo } from "../utils/log.js";
import type { GeneratorOptions } from "../types.js";

function normalizeName(name: string): string {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, "-");
  if (!/^[a-z0-9._-]+$/.test(normalized)) {
    throw new Error("Nome inválido. Use apenas letras minúsculas, números, ponto, underscore e hífen.");
  }
  return normalized;
}

export async function runNewSkillCommand(name: string, options: GeneratorOptions): Promise<void> {
  const safeName = normalizeName(name);
  const root = options.path ? path.resolve(options.path) : process.cwd();
  const target = path.join(root, "skills", `${safeName}.md`);
  const scaffold = fs.readFileSync(path.join(SCAFFOLDS_PATH, "skill.md"), "utf-8");
  const content = scaffold.replaceAll("{{name}}", safeName);

  writeFileExclusive(target, content);
  logInfo(`Skill criada: ${target}`);
}
