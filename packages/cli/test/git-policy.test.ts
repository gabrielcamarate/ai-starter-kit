import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

test("política de git impede git add ponto", () => {
  const gitUtil = fs.readFileSync(path.resolve("src/utils/git.ts"), "utf-8");
  assert.equal(gitUtil.includes("git add ."), false);
});

test("mensagens de commit incluem o que e por que", () => {
  const gitUtil = fs.readFileSync(path.resolve("src/utils/git.ts"), "utf-8");
  assert.match(gitUtil, /What changed:/);
  assert.match(gitUtil, /Why:/);
});

test("mensagens automáticas do init --git são somente em inglês", () => {
  const gitUtil = fs.readFileSync(path.resolve("src/utils/git.ts"), "utf-8");
  assert.equal(gitUtil.includes("O que foi alterado:"), false);
  assert.equal(gitUtil.includes("Por que foi alterado:"), false);
});

test("init --git usa arquivo de mensagem com git commit -F", () => {
  const gitUtil = fs.readFileSync(path.resolve("src/utils/git.ts"), "utf-8");
  assert.equal(gitUtil.includes("\"commit\", \"-m\""), false);
  assert.equal(gitUtil.includes("\"commit\", \"-F\""), true);
});
