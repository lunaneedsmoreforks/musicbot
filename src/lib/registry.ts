import { Awaitable, Client, ClientEvents } from "discord.js-selfbot-v13";
import { Command, CommandContext, ICommandable } from "./command";
import Module from "./module";
import { owners, ownersOnly } from "../config";


class Registry {
  bot: null | Client = null;
  listeners: Map<number, (...args: any[]) => Awaitable<void>> = new Map(); 
  batch: Map<keyof ClientEvents, Array<number>> = new Map();
  commands: Array<ICommandable> = new Array();
  modules: Array<Module> = new Array();
  commandListenerId: number = 0;
  addEventListener<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>): number {
    if (!this.bot) throw new Error("Bot not set");
    this.bot.on(event, listener);
    const id = Math.random() * 100000000000000000;
    this.listeners.set(id, listener as (...args: any[]) => Awaitable<void>);
    if (!this.batch.has(event)) this.batch.set(event, []);
    this.batch.get(event)?.push(id);
    return id;
  }
  removeEventListener(id: number) {
    if (!this.bot) throw new Error("Bot not set");
    const listener = this.listeners.get(id);
    if (!listener) throw new Error("Listener not found");
    this.batch.forEach((ids, event) => {
      if (ids.includes(id)) {
        this.bot?.removeAllListeners(event);
        ids.splice(ids.indexOf(id), 1);
        this.listeners.delete(id);
        ids.forEach((id) => {
          this.bot?.on(event, this.listeners.get(id) as (...args: any[]) => Awaitable<void>);
        })
      }
    })
  }
  setBot(bot: Client) {
    if (this.bot) throw new Error("Bot already set");
    this.bot = bot;
  }
  registerCommand(command: ICommandable) {
    console.log(`Registering command ${command.name}`)
    this.commands.push(command);
  }

  injectCommands() {
    if (!this.bot) throw new Error("Bot not set");
    if (this.commandListenerId) return; // just in case
    this.commandListenerId = this.addEventListener("messageCreate", async (message) => {
      
      if (ownersOnly && !owners.includes(message.author.id)) return;
      
      const context = new CommandContext(message, this.bot!!);
      let matched = false;
      for (const command of this.commands) {
        if (await command.check(context)) {
          await command.run(context);
          matched = true;
          break;
        }
      }
      if (!matched && ["h", "help"].includes(context.commandName || "")) {

        let helpMessage = `**Commands**\n`;
        this.commands.forEach((command) => {
          helpMessage += `\`${command.name}\` - ${command.description}\n`;
          helpMessage += `Usage: \`${command.usage}\`\n`;
        })
        await message.channel.send(helpMessage);

      }
    })
  }

  registerModule(module: Module) {
    this.modules.push(module);
    module.commands.forEach((command) => {
      this.registerCommand(command);
    })
    module.eventListeners.forEach((listener, event) => {
      this.addEventListener(event, listener);
    })
  }
  disableModule(moduleName: string) {
    this.modules.forEach((module) => {
      if (module.name === moduleName) {
        module.commands.forEach((command) => {
          this.disableCommand(command.name);
        })
        module.eventListeners.forEach((listener, event) => {
          this.removeEventListener(this.batch.get(event)?.find((id) => this.listeners.get(id) === listener) as number);
        })
      }
    })
  }
  
  disableCommand(commandName: string) {
    this.commands.forEach((command) => {
      if (command.name === commandName) command.disable();
    })
  }
  enableCommand(commandName: string) {
    this.commands.forEach((command) => {
      if (command.name === commandName) command.enable();
    })
  }
  constructor(bot?: Client) {
    bot? this.bot = bot: null;
    bot? this.injectCommands(): null; // commands added after this will still work because of js quirkiness
  }

  login(token?: string) {
    if (!this.bot) throw new Error("Bot not set");
    this.bot.login(token);
  }
}



export default Registry;