import fs from "node:fs";
import path from "node:path";
import { TEMPLATES_ROOT } from "../constants.js";
import type { TemplateId } from "../types.js";

interface TemplateEntry {
  id: TemplateId;
  description: string;
  path: string;
}

interface Catalog {
  templates: TemplateEntry[];
}

export function getTemplatePath(templateId: TemplateId): string {
  const catalogPath = path.join(TEMPLATES_ROOT, "catalog.json");
  const raw = fs.readFileSync(catalogPath, "utf-8");
  const catalog = JSON.parse(raw) as Catalog;

  const match = catalog.templates.find((template) => template.id === templateId);
  if (!match) {
    throw new Error(`Template não encontrado: ${templateId}`);
  }

  return path.join(TEMPLATES_ROOT, match.path);
}
