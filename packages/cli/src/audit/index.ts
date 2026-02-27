import { checkCi } from "./checks/ci.js";
import { checkGitignore } from "./checks/gitignore.js";
import { checkLockfile } from "./checks/lockfile.js";
import { checkInsecureScripts } from "./checks/scripts.js";
import { checkSecrets } from "./checks/secrets.js";
import { checkStructure } from "./checks/structure.js";
import type { AuditFinding } from "../types.js";

export function runAuditChecks(targetPath: string): { findings: AuditFinding[]; limitations: string[] } {
  const findings: AuditFinding[] = [];
  const limitations: string[] = [];

  findings.push(...checkStructure(targetPath));
  findings.push(...checkGitignore(targetPath));
  findings.push(...checkLockfile(targetPath));
  findings.push(...checkCi(targetPath));
  findings.push(...checkInsecureScripts(targetPath));

  const secretResult = checkSecrets(targetPath);
  findings.push(...secretResult.findings);
  if (secretResult.limitation) {
    limitations.push(secretResult.limitation);
  }

  return { findings, limitations };
}
