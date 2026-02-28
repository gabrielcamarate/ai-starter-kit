import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const expectedEntries = new Set([
  ".github",
  ".github/CODEOWNERS",
  ".github/pull_request_template.md",
  ".github/workflows",
  ".github/workflows/ci.yml",
  ".github/workflows/post-merge.yml",
  "agents",
  "agents/README.md",
  "agents/agent_rules.md",
  "agents/prompts",
  "agents/prompts/CREATE_SKILL.md",
  "agents/prompts/INIT_PROJECT.md",
  "agents/prompts/RETROFIT_PROJECT.md",
  "controls",
  "controls/doc_first.md",
  "controls/quality.md",
  "controls/security.md",
  "docs",
  "docs/OPERATING_SYSTEM.md",
  "docs/QUICKSTART.md",
  "docs/REPO_SETTINGS.md",
  "docs/RETROFIT_GUIDE.md",
  "docs/TEMPLATES_GUIDE.md",
  "security",
  "security/SECURITY_CHECKLIST.md",
  "security/THREAT_MODEL_TEMPLATE.md",
  "skills",
  "skills/README.md",
  "skills/examples",
  "skills/examples/agent-example.md",
  "skills/examples/doc-first-context7",
  "skills/examples/doc-first-context7/meta.json",
  "skills/examples/doc-first-context7/skill.md",
  "skills/examples/skill-example.md",
  "skills/registry.json",
  "skills/templates",
  "skills/templates/agent.template.md",
  "skills/templates/control.template.md",
  "skills/templates/skill.template.md",
  "scripts",
  "scripts/smoke-templates.mjs",
  "scripts/validate-structure.mjs",
  "scripts/validate-templates.mjs",
  "packages",
  "packages/cli",
  "packages/cli/package.json",
  "packages/cli/tsconfig.json",
  "packages/cli/src",
  "packages/cli/src/constants.ts",
  "packages/cli/src/index.ts",
  "packages/cli/src/types.ts",
  "packages/cli/src/audit",
  "packages/cli/src/audit/index.ts",
  "packages/cli/src/audit/report.ts",
  "packages/cli/src/audit/checks",
  "packages/cli/src/audit/checks/ci.ts",
  "packages/cli/src/audit/checks/gitignore.ts",
  "packages/cli/src/audit/checks/lockfile.ts",
  "packages/cli/src/audit/checks/scripts.ts",
  "packages/cli/src/audit/checks/secrets.ts",
  "packages/cli/src/audit/checks/structure.ts",
  "packages/cli/src/commands",
  "packages/cli/src/commands/audit.ts",
  "packages/cli/src/commands/init.ts",
  "packages/cli/src/commands/new-agent.ts",
  "packages/cli/src/commands/new-control.ts",
  "packages/cli/src/commands/new-skill.ts",
  "packages/cli/src/skills",
  "packages/cli/src/skills/registry.ts",
  "packages/cli/src/template",
  "packages/cli/src/template/catalog.ts",
  "packages/cli/src/template/copy.ts",
  "packages/cli/src/utils",
  "packages/cli/src/utils/fs.ts",
  "packages/cli/src/utils/git.ts",
  "packages/cli/src/utils/log.ts",
  "packages/cli/src/utils/process.ts",
  "packages/cli/test",
  "packages/cli/test/audit.test.ts",
  "packages/cli/test/generators.test.ts",
  "packages/cli/test/git-policy.test.ts",
  "packages/cli/test/init.test.ts",
  "packages/templates",
  "packages/templates/package.json",
  "packages/templates/catalog.json",
  "packages/templates/base",
  "packages/templates/base/agents",
  "packages/templates/base/agents/README.md",
  "packages/templates/base/agents/agent_rules.md",
  "packages/templates/base/controls",
  "packages/templates/base/controls/doc_first.md",
  "packages/templates/base/controls/quality.md",
  "packages/templates/base/controls/security.md",
  "packages/templates/base/docs",
  "packages/templates/base/docs/QUICKSTART.md",
  "packages/templates/base/docs/RETROFIT_GUIDE.md",
  "packages/templates/base/docs/TEMPLATES_GUIDE.md",
  "packages/templates/base/security",
  "packages/templates/base/security/SECURITY_CHECKLIST.md",
  "packages/templates/base/security/THREAT_MODEL_TEMPLATE.md",
  "packages/templates/base/skills",
  "packages/templates/base/skills/README.md",
  "packages/templates/base/skills/examples",
  "packages/templates/base/skills/examples/agent-example.md",
  "packages/templates/base/skills/examples/doc-first-context7",
  "packages/templates/base/skills/examples/doc-first-context7/meta.json",
  "packages/templates/base/skills/examples/doc-first-context7/skill.md",
  "packages/templates/base/skills/examples/skill-example.md",
  "packages/templates/base/skills/registry.json",
  "packages/templates/base/skills/templates",
  "packages/templates/base/skills/templates/agent.template.md",
  "packages/templates/base/skills/templates/control.template.md",
  "packages/templates/base/skills/templates/skill.template.md",
  "packages/templates/project-templates",
  "packages/templates/project-templates/react-ts",
  "packages/templates/project-templates/react-ts/README.md",
  "packages/templates/project-templates/react-ts/template",
  "packages/templates/project-templates/react-ts/template/.gitignore",
  "packages/templates/project-templates/react-ts/template/index.html",
  "packages/templates/project-templates/react-ts/template/package.json",
  "packages/templates/project-templates/react-ts/template/tsconfig.json",
  "packages/templates/project-templates/react-ts/template/vite.config.ts",
  "packages/templates/project-templates/react-ts/template/src",
  "packages/templates/project-templates/react-ts/template/src/App.tsx",
  "packages/templates/project-templates/react-ts/template/src/main.tsx",
  "packages/templates/project-templates/react-ts/template/src/smoke.test.ts",
  "packages/templates/project-templates/python",
  "packages/templates/project-templates/python/README.md",
  "packages/templates/project-templates/python/template",
  "packages/templates/project-templates/python/template/.gitignore",
  "packages/templates/project-templates/python/template/pyproject.toml",
  "packages/templates/project-templates/python/template/src",
  "packages/templates/project-templates/python/template/src/app",
  "packages/templates/project-templates/python/template/src/app/__init__.py",
  "packages/templates/project-templates/python/template/tests",
  "packages/templates/project-templates/python/template/tests/test_smoke.py",
  "packages/templates/scaffolds",
  "packages/templates/scaffolds/agent.md",
  "packages/templates/scaffolds/control.md",
  "packages/templates/scaffolds/skill.meta.json",
  "packages/templates/scaffolds/skill.md",
  ".gitignore",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "DESIGN.md",
  "GITHUB_PUBLISH.md",
  "LICENSE",
  "README.md",
  "SECURITY.md",
  "package.json",
  "pnpm-workspace.yaml",
  "tsconfig.base.json"
]);

const ignored = new Set([
  ".git",
  "node_modules",
  "pnpm-lock.yaml",
  "dist",
  ".pnpm-store"
]);

/** @type {string[]} */
const actual = [];

function walk(currentAbs, currentRel) {
  const entries = fs.readdirSync(currentAbs, { withFileTypes: true });
  for (const entry of entries) {
    const rel = currentRel ? path.join(currentRel, entry.name) : entry.name;
    if (ignored.has(entry.name) || ignored.has(rel)) {
      continue;
    }
    actual.push(rel);
    if (entry.isDirectory()) {
      walk(path.join(currentAbs, entry.name), rel);
    }
  }
}

walk(root, "");

const actualSet = new Set(actual);
const missing = [...expectedEntries].filter((p) => !actualSet.has(p));
const extra = [...actualSet].filter((p) => !expectedEntries.has(p));

if (missing.length > 0 || extra.length > 0) {
  console.error("[validate-structure] Estrutura inválida.");
  if (missing.length > 0) {
    console.error("[validate-structure] Faltando:");
    for (const item of missing.sort()) {
      console.error(`  - ${item}`);
    }
  }
  if (extra.length > 0) {
    console.error("[validate-structure] Extras fora do plano:");
    for (const item of extra.sort()) {
      console.error(`  - ${item}`);
    }
  }
  process.exit(1);
}

console.log("[validate-structure] Estrutura corresponde ao plano.");
