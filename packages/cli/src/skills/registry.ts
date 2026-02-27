import fs from "node:fs";
import path from "node:path";
import type { SkillMeta, SkillRegistry, SkillRegistryEntry, SkillStatus } from "../types.js";
import { logInfo } from "../utils/log.js";

const SKILL_NAME_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SKILLS_DIRNAME = "skills";
const REGISTRY_FILENAME = "registry.json";
const EXCLUDED_DIRECTORIES = new Set(["examples", "templates"]);
const EXCLUDED_FILES = new Set(["README.md", REGISTRY_FILENAME]);

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isSkillStatus(value: unknown): value is SkillStatus {
  return value === "active" || value === "deprecated";
}

function assertKebabCase(name: string, context: string): void {
  if (!SKILL_NAME_REGEX.test(name)) {
    throw new Error(`${context}: nome de skill inválido "${name}". Use kebab-case.`);
  }
}

function parseMeta(metaPath: string): SkillMeta {
  const raw = fs.readFileSync(metaPath, "utf-8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`meta.json inválido em ${metaPath}: JSON malformado.`);
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error(`meta.json inválido em ${metaPath}: objeto esperado.`);
  }

  const meta = parsed as Record<string, unknown>;

  if (typeof meta.name !== "string" || meta.name.length === 0) {
    throw new Error(`meta.json inválido em ${metaPath}: "name" deve ser string não vazia.`);
  }
  assertKebabCase(meta.name, `meta.json inválido em ${metaPath}`);

  if (typeof meta.version !== "string" || meta.version.trim().length === 0) {
    throw new Error(`meta.json inválido em ${metaPath}: "version" deve ser string não vazia.`);
  }

  if (!isSkillStatus(meta.status)) {
    throw new Error(`meta.json inválido em ${metaPath}: "status" deve ser "active" ou "deprecated".`);
  }

  if (typeof meta.requires_docs !== "boolean") {
    throw new Error(`meta.json inválido em ${metaPath}: "requires_docs" deve ser boolean.`);
  }

  if (!isStringArray(meta.tags)) {
    throw new Error(`meta.json inválido em ${metaPath}: "tags" deve ser array de strings.`);
  }
  if (!isStringArray(meta.doc_sources)) {
    throw new Error(`meta.json inválido em ${metaPath}: "doc_sources" deve ser array de strings.`);
  }
  if (!isStringArray(meta.inputs)) {
    throw new Error(`meta.json inválido em ${metaPath}: "inputs" deve ser array de strings.`);
  }
  if (!isStringArray(meta.outputs)) {
    throw new Error(`meta.json inválido em ${metaPath}: "outputs" deve ser array de strings.`);
  }

  return {
    name: meta.name,
    version: meta.version,
    status: meta.status,
    tags: meta.tags,
    requires_docs: meta.requires_docs,
    doc_sources: meta.doc_sources,
    inputs: meta.inputs,
    outputs: meta.outputs
  };
}

function createLegacyEntry(filePath: string, name: string): SkillRegistryEntry {
  return {
    name,
    path: filePath,
    version: "1.0.0",
    status: "active",
    tags: ["legacy"],
    requires_docs: false,
    doc_sources: [],
    inputs: [],
    outputs: [],
    format: "legacy"
  };
}

export function normalizeSkillName(input: string): string {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, "-");
  assertKebabCase(normalized, "Nome inválido");
  return normalized;
}

export function readSkillRegistry(rootPath: string): SkillRegistry {
  const skillsDir = path.join(rootPath, SKILLS_DIRNAME);
  if (!fs.existsSync(skillsDir)) {
    return { skills: [] };
  }

  const collisions: string[] = [];
  const entriesByName = new Map<string, SkillRegistryEntry>();
  const sourcesByName = new Map<string, string>();

  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }
    if (EXCLUDED_FILES.has(entry.name)) {
      continue;
    }

    const name = entry.name.replace(/\.md$/i, "");
    assertKebabCase(name, `Skill legada inválida em ${path.join(SKILLS_DIRNAME, entry.name)}`);
    const relativePath = path.posix.join(SKILLS_DIRNAME, entry.name);
    entriesByName.set(name, createLegacyEntry(relativePath, name));
    sourcesByName.set(name, relativePath);
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    if (EXCLUDED_DIRECTORIES.has(entry.name)) {
      continue;
    }

    const skillDir = path.join(skillsDir, entry.name);
    const skillFile = path.join(skillDir, "skill.md");
    const metaFile = path.join(skillDir, "meta.json");

    if (!fs.existsSync(skillFile) && !fs.existsSync(metaFile)) {
      continue;
    }

    if (!fs.existsSync(skillFile) || !fs.existsSync(metaFile)) {
      throw new Error(
        `Skill v2 incompleta em ${path.posix.join(SKILLS_DIRNAME, entry.name)}: esperado skill.md e meta.json.`
      );
    }

    const meta = parseMeta(metaFile);
    assertKebabCase(entry.name, `Pasta de skill inválida em ${path.posix.join(SKILLS_DIRNAME, entry.name)}`);
    if (meta.name !== entry.name) {
      throw new Error(
        `Inconsistência em ${path.posix.join(SKILLS_DIRNAME, entry.name, "meta.json")}: "name" deve ser "${entry.name}".`
      );
    }

    const relativePath = path.posix.join(SKILLS_DIRNAME, entry.name, "skill.md");
    const previous = entriesByName.get(meta.name);

    if (previous && previous.format === "v2") {
      const source = sourcesByName.get(meta.name) ?? "desconhecida";
      throw new Error(`Nome de skill duplicado "${meta.name}" entre skills v2 (${source} e ${relativePath}).`);
    }

    if (previous && previous.format === "legacy") {
      collisions.push(meta.name);
    }

    entriesByName.set(meta.name, {
      ...meta,
      path: relativePath,
      format: "v2"
    });
    sourcesByName.set(meta.name, relativePath);
  }

  const sorted = [...entriesByName.values()].sort((a, b) => a.name.localeCompare(b.name));

  if (collisions.length > 0) {
    for (const name of collisions.sort()) {
      logInfo(`Colisão detectada para "${name}": skill v2 priorizada sobre skill legacy.`);
    }
  }

  return { skills: sorted };
}

export function writeSkillRegistry(rootPath: string): SkillRegistry {
  const registry = readSkillRegistry(rootPath);
  const skillsDir = path.join(rootPath, SKILLS_DIRNAME);
  fs.mkdirSync(skillsDir, { recursive: true });

  const registryPath = path.join(skillsDir, REGISTRY_FILENAME);
  fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`, "utf-8");

  return registry;
}
