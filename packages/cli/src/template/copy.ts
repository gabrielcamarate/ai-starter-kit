import path from "node:path";
import { BASE_TEMPLATE_PATH } from "../constants.js";
import { copyTree } from "../utils/fs.js";

export function copyBaseTemplate(targetDir: string, overwrite = false): string[] {
  return copyTree(BASE_TEMPLATE_PATH, targetDir, overwrite);
}

export function copyProjectTemplate(templatePath: string, targetDir: string, overwrite = false): string[] {
  return copyTree(templatePath, targetDir, overwrite);
}

export function toRelativeFiles(root: string, files: string[]): string[] {
  return files.map((file) => path.resolve(root, path.relative(root, file)));
}
