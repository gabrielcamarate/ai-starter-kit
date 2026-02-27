import fs from "node:fs";
import path from "node:path";
import { ALLOWED_TEMPLATES, REQUIRED_BASE_ITEMS } from "../constants.js";
import { getTemplatePath } from "../template/catalog.js";
import { copyBaseTemplate, copyProjectTemplate } from "../template/copy.js";
import { runGitInitWithTwoCommits } from "../utils/git.js";
import { ensureDir, exists, isDirectoryEmpty } from "../utils/fs.js";
import { logInfo } from "../utils/log.js";
import type { InitOptions, TemplateId } from "../types.js";

function validateProjectName(projectName: string): void {
  if (!/^[a-zA-Z0-9._-]+$/.test(projectName)) {
    throw new Error("Nome de projeto inválido. Use apenas letras, números, ponto, underscore e hífen.");
  }
}

function validateTemplate(template: string): asserts template is TemplateId {
  if (!ALLOWED_TEMPLATES.includes(template as TemplateId)) {
    throw new Error(`Template inválido: ${template}. Use react-ts ou python.`);
  }
}

function validateResult(targetPath: string): void {
  for (const item of REQUIRED_BASE_ITEMS) {
    const fullPath = path.join(targetPath, item);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Falha na criação do projeto. Item obrigatório ausente: ${item}`);
    }
  }
}

export async function runInitCommand(projectName: string, options: InitOptions): Promise<void> {
  validateProjectName(projectName);
  validateTemplate(options.template);

  const baseDir = options.path ? path.resolve(options.path) : process.cwd();
  const targetPath = path.join(baseDir, projectName);

  let allowOverwrite = false;
  if (exists(targetPath)) {
    const stat = fs.statSync(targetPath);
    if (!stat.isDirectory()) {
      throw new Error(`Caminho de destino não é diretório: ${targetPath}`);
    }
    const empty = isDirectoryEmpty(targetPath);
    if (!empty && !options.yes) {
      throw new Error(
        `Diretório alvo já existe e não está vazio: ${targetPath}. Use --yes para confirmar sobrescrita explícita.`
      );
    }
    allowOverwrite = !empty && Boolean(options.yes);
  } else {
    ensureDir(targetPath);
  }

  const baseFiles = copyBaseTemplate(targetPath, allowOverwrite);
  const templatePath = getTemplatePath(options.template);
  const templateFiles = copyProjectTemplate(templatePath, targetPath, allowOverwrite);

  validateResult(targetPath);
  logInfo(`Projeto criado em ${targetPath} com template ${options.template}.`);

  if (options.git) {
    runGitInitWithTwoCommits({
      cwd: targetPath,
      projectName,
      template: options.template,
      baseFiles,
      templateFiles
    });
  }
}
