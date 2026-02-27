#!/usr/bin/env node
import { Command } from "commander";
import { runAuditCommand } from "./commands/audit.js";
import { runInitCommand } from "./commands/init.js";
import { runNewAgentCommand } from "./commands/new-agent.js";
import { runNewControlCommand } from "./commands/new-control.js";
import { runNewSkillCommand } from "./commands/new-skill.js";
import { logError } from "./utils/log.js";
import type { TemplateId } from "./types.js";

async function main(): Promise<void> {
  const program = new Command();

  program.name("askit").description("CLI do ai-starter-kit").showHelpAfterError(true);

  program
    .command("init")
    .argument("<project-name>", "Nome do projeto")
    .option("--template <template>", "Template: react-ts|python", "react-ts")
    .option("--path <path>", "Diretório pai de criação")
    .option("--git", "Inicializa git e cria 2 commits")
    .option("--yes", "Confirma sobrescrita de diretório não vazio")
    .action(async (projectName, options) => {
      await runInitCommand(projectName, {
        template: options.template as TemplateId,
        path: options.path,
        git: Boolean(options.git),
        yes: Boolean(options.yes)
      });
    });

  program
    .command("new:skill")
    .argument("<name>", "Nome da skill")
    .option("--path <path>", "Diretório do projeto")
    .action(async (name, options) => {
      await runNewSkillCommand(name, { path: options.path });
    });

  program
    .command("new:agent")
    .argument("<name>", "Nome do agent")
    .option("--path <path>", "Diretório do projeto")
    .action(async (name, options) => {
      await runNewAgentCommand(name, { path: options.path });
    });

  program
    .command("new:control")
    .argument("<name>", "Nome do control")
    .option("--path <path>", "Diretório do projeto")
    .action(async (name, options) => {
      await runNewControlCommand(name, { path: options.path });
    });

  program
    .command("audit")
    .option("--path <path>", "Diretório do projeto")
    .option("--out <file>", "Arquivo de saída do relatório")
    .action(async (options) => {
      await runAuditCommand({ path: options.path, out: options.out });
    });

  await program.parseAsync(process.argv);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  logError(message);
  process.exit(1);
});
