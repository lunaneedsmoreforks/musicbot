import { Command, CommandContext, ICommandable } from "./command";


class CommandModule implements ICommandable {
  name: string;
  description: string;
  usage: string;
  disabled: boolean = false;
  subcommands: Array<ICommandable> = new Array();
  rootCommand: Command | null = null;
  depth: number = 0;
  constructor({ name, description, usage }: { name: string, description: string, usage: string }) {
    this.name = name;
    this.description = description;
    this.usage = usage;
  }

  async check(commandContext: CommandContext): Promise<boolean> {
    if (this.disabled) return false;
    if (this.depth == 0) return commandContext.commandName != null && (
      this.name === commandContext.commandName.toLowerCase()
    );
    else {
      let cmdName = commandContext.args?.[this.depth-1];
      if (!cmdName) return false;
      return this.name === cmdName.toLowerCase();
    }
  }
  async run(commandContext: CommandContext): Promise<void> {
    if (this.rootCommand) {
      if (await this.rootCommand.check(commandContext)) {
        await this.rootCommand.run(commandContext);
        return;
      }
    }
    for (const subcommand of this.subcommands) {
      if (await subcommand.check(commandContext)) {
        await subcommand.run(commandContext);
        return;
      }
    }
    let subcommandName = commandContext.args?.[this.depth]
    if (["h", "help"].includes(subcommandName!!)) {
      let helpMessage = `**${this.name} Commands**\n`;
      this.subcommands.forEach((command) => {
        helpMessage += `\`${command.name}\` - ${command.description}\n`;
      })
      await commandContext.channel.send(helpMessage);
    }
    
  }
  disable() {
    return;
  }
  enable() {
    return;
  }
  withRootCommand(command: Command) {
    this.rootCommand = command;
    return this;
  }
  withSubcommand(subcommand: ICommandable) {
    subcommand.depth = this.depth + 1;
    this.subcommands.push(subcommand);
    return this;
  }

}

export { CommandModule }