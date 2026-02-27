import fs from "node:fs";
import path from "node:path";

export function exists(targetPath: string): boolean {
  return fs.existsSync(targetPath);
}

export function ensureDir(targetPath: string): void {
  fs.mkdirSync(targetPath, { recursive: true });
}

export function isDirectoryEmpty(targetPath: string): boolean {
  const entries = fs.readdirSync(targetPath);
  return entries.length === 0;
}

export function ensureDirectoryOrThrow(targetPath: string): void {
  if (!exists(targetPath)) {
    throw new Error(`Diretório não encontrado: ${targetPath}`);
  }
  const stat = fs.statSync(targetPath);
  if (!stat.isDirectory()) {
    throw new Error(`Caminho não é diretório: ${targetPath}`);
  }
}

export function copyTree(sourceDir: string, targetDir: string, overwrite = false): string[] {
  const createdFiles: string[] = [];
  const stack: Array<{ source: string; target: string }> = [{ source: sourceDir, target: targetDir }];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }

    ensureDir(current.target);
    const entries = fs.readdirSync(current.source, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(current.source, entry.name);
      const targetPath = path.join(current.target, entry.name);
      if (entry.isDirectory()) {
        stack.push({ source: sourcePath, target: targetPath });
        continue;
      }
      if (overwrite) {
        fs.copyFileSync(sourcePath, targetPath);
      } else {
        fs.copyFileSync(sourcePath, targetPath, fs.constants.COPYFILE_EXCL);
      }
      createdFiles.push(targetPath);
    }
  }

  return createdFiles;
}

export function writeFileExclusive(targetPath: string, content: string): void {
  const dir = path.dirname(targetPath);
  ensureDir(dir);
  fs.writeFileSync(targetPath, content, { flag: "wx" });
}
