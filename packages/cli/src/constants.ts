import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);

export const REPO_ROOT = path.resolve(currentDir, "../../..");
export const TEMPLATES_ROOT = path.join(REPO_ROOT, "packages", "templates");
export const BASE_TEMPLATE_PATH = path.join(TEMPLATES_ROOT, "base");
export const SCAFFOLDS_PATH = path.join(TEMPLATES_ROOT, "scaffolds");
export const TEMPLATE_PROJECTS_PATH = path.join(TEMPLATES_ROOT, "project-templates");

export const REQUIRED_BASE_ITEMS = [
  "agents/agent_rules.md",
  "security/SECURITY_CHECKLIST.md",
  "skills/examples/skill-example.md"
];

export const ALLOWED_TEMPLATES = ["react-ts", "python"] as const;
