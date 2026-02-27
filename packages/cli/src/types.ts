export type TemplateId = "react-ts" | "python";
export type SkillStatus = "active" | "deprecated";

export interface InitOptions {
  template: TemplateId;
  path?: string;
  git?: boolean;
  yes?: boolean;
}

export interface GeneratorOptions {
  path?: string;
}

export interface AuditOptions {
  path?: string;
  out?: string;
}

export type AuditSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface AuditFinding {
  id: string;
  title: string;
  severity: AuditSeverity;
  details: string;
  recommendation: string;
  file?: string;
}

export interface AuditReport {
  targetPath: string;
  generatedAt: string;
  findings: AuditFinding[];
  limitations: string[];
}

export interface SkillMeta {
  name: string;
  version: string;
  status: SkillStatus;
  tags: string[];
  requires_docs: boolean;
  doc_sources: string[];
  inputs: string[];
  outputs: string[];
}

export interface SkillRegistryEntry extends SkillMeta {
  path: string;
  format: "v2" | "legacy";
}

export interface SkillRegistry {
  skills: SkillRegistryEntry[];
}
