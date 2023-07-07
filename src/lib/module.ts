

import { Awaitable, ClientEvents } from "discord.js-selfbot-v13";
import { Command, ICommandable } from "./command";


class Module {
  name: string;
  
  eventListeners: Map<
    keyof ClientEvents, 
    (...args: any[]) => Awaitable<void>
  > = new Map();

  commands: Array<ICommandable> = new Array();

  constructor(name: string) {
    this.name = name;
  }

  withEventListener<K extends keyof ClientEvents>(
    event: K,
    listener: (...args: ClientEvents[K]) => Awaitable<void>
  ) {
    this.eventListeners.set(event, listener as (...args: any[]) => Awaitable<void>);
    return this;
  }
  withCommand(command: ICommandable) {
    this.commands.push(command);
    return this;
  }
}

export default Module;