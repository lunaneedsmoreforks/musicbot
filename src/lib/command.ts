import { Awaitable, Channel, Client, Guild, Message, TextBasedChannel, User } from "discord.js";
import { prefix } from "../config";

class CommandContext {
  public message: Message;
  public caller: User;
  public inGuild: boolean;
  public guild?: Guild;
  public channel: TextBasedChannel;
  public bot: Client;
  
  public commandName?: string;
  public args?: string[];
  public restMessage?: string;

  constructor(message: Message, bot: Client) {
    this.message = message;
    this.caller = message.author;
    this.inGuild = message.guild !== null;
    if (this.inGuild) this.guild = message.guild as Guild;
    this.channel = message.channel;
    this.bot = bot;
    if (message.content.startsWith(prefix)) {
      let content = message.content.substring(prefix.length);
      let command = content.split(' ')[0];
      let remainingMessage = content.substring(command.length + 1);

      this.commandName = command;
      this.args = remainingMessage.split(' ');
      this.restMessage = remainingMessage;
    }
  }
}

class Command implements ICommandable {
  aliases: string[];
  name: string;
  description: string;
  usage: string;
  callback: (context: CommandContext) => Awaitable<void>;
  disabled: boolean = false;

  depth: number = 0;

  constructor(options: {
    aliases: string[],
    name: string,
    description: string,
    usage: string,
    depth?: number,
    callback: (context: CommandContext) => Awaitable<void>
  }) {
    this.aliases = options.aliases.map((alias) => alias.toLowerCase());
    this.name = options.name.toLowerCase();
    this.description = options.description;
    this.usage = options.usage;
    this.callback = options.callback;
    if (options.depth) this.depth = options.depth;
  }

  async check(commandContext: CommandContext): Promise<boolean> {
    // return (!this.disabled) && commandContext.commandName != null && (
    //   this.aliases.includes(commandContext.commandName.toLowerCase()) || 
    //   this.name === commandContext.commandName.toLowerCase()
    // );
    if (this.disabled) return false;
    if (this.depth == 0) return commandContext.commandName != null && (
      this.aliases.includes(commandContext.commandName.toLowerCase()) ||
      this.name === commandContext.commandName.toLowerCase()
    );
    else {
      let cmdName = commandContext.args?.[this.depth-1];
      if (!cmdName) return false;
      return this.aliases.includes(cmdName.toLowerCase()) || this.name === cmdName.toLowerCase();
    }
      
  }

  async run(commandContext: CommandContext): Promise<void> {
    await this.callback(commandContext);
  }

  disable() {
    this.disabled = true;
  }
  enable() {
    this.disabled = false;
  }

}

interface ICommandable {
  name: string;
  description: string;
  usage: string;
  depth: number;
  check(commandContext: CommandContext): Promise<boolean>;
  run(commandContext: CommandContext): Promise<void>
  disable(): void;
  enable(): void;
}


export { Command, CommandContext, ICommandable };