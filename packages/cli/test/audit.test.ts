import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { runAuditCommand } from "../src/commands/audit.js";

test("audit gera relatório markdown", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "askit-audit-"));
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ name: "x", scripts: {} }), "utf-8");

  const outFile = path.join(root, "REPORT.md");
  await runAuditCommand({ path: root, out: outFile });

  assert.equal(fs.existsSync(outFile), true);
  const content = fs.readFileSync(outFile, "utf-8");
  assert.match(content, /AUDIT REPORT/);
  assert.match(content, /Lacunas e riscos/);
});
