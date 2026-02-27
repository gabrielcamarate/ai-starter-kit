import { spawnSync } from "node:child_process";

export interface ProcessResult {
  code: number;
  stdout: string;
  stderr: string;
}

export function commandExists(command: string): boolean {
  const result = spawnSync(command, ["--version"], {
    stdio: "pipe",
    encoding: "utf-8"
  });
  return result.status === 0;
}

export function run(command: string, args: string[], cwd: string): ProcessResult {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "pipe",
    encoding: "utf-8"
  });

  return {
    code: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? ""
  };
}
