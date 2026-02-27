import fs from "node:fs";
import path from "node:path";

const required = [
  "packages/templates/catalog.json",
  "packages/templates/scaffolds/skill.md",
  "packages/templates/scaffolds/agent.md",
  "packages/templates/scaffolds/control.md",
  "packages/templates/project-templates/react-ts/README.md",
  "packages/templates/project-templates/react-ts/template/package.json",
  "packages/templates/project-templates/react-ts/template/index.html",
  "packages/templates/project-templates/react-ts/template/tsconfig.json",
  "packages/templates/project-templates/react-ts/template/vite.config.ts",
  "packages/templates/project-templates/react-ts/template/src/main.tsx",
  "packages/templates/project-templates/react-ts/template/src/App.tsx",
  "packages/templates/project-templates/react-ts/template/src/smoke.test.ts",
  "packages/templates/project-templates/python/README.md",
  "packages/templates/project-templates/python/template/pyproject.toml",
  "packages/templates/project-templates/python/template/src/app/__init__.py",
  "packages/templates/project-templates/python/template/tests/test_smoke.py"
];

const missing = required.filter((item) => !fs.existsSync(path.resolve(item)));

if (missing.length > 0) {
  console.error("[validate-templates] Arquivos obrigatórios ausentes:");
  for (const item of missing) {
    console.error(`  - ${item}`);
  }
  process.exit(1);
}

const catalogPath = path.resolve("packages/templates/catalog.json");
const catalogRaw = fs.readFileSync(catalogPath, "utf-8");
const catalog = JSON.parse(catalogRaw);

if (!Array.isArray(catalog.templates) || catalog.templates.length < 2) {
  console.error("[validate-templates] catalog.json inválido: expected >=2 templates.");
  process.exit(1);
}

const ids = new Set(catalog.templates.map((t) => t.id));
if (!ids.has("react-ts") || !ids.has("python")) {
  console.error("[validate-templates] catalog.json deve conter react-ts e python.");
  process.exit(1);
}

console.log("[validate-templates] Templates mínimos válidos.");
