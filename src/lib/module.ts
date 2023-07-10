

import { Awaitable, ClientEvents } from "discord.js";
import { Command, ICommandable } from "./command";
import { DiscordEventListener } from "./eventListener";


class Module {
  name: string;
  
  eventListeners: Map<
    keyof ClientEvents, 
    (...args: any[]) => Awaitable<void>
  > = new Map();

  commands: Array<ICommandable> = new Array();

  constructor({ name }: { name: string }) {
    this.name = name;
  }

  withEventListener<K extends keyof ClientEvents>(
    event: K,
    listener: (...args: ClientEvents[K]) => Awaitable<void>
  ) {
    this.eventListeners.set(event, listener as (...args: any[]) => Awaitable<void>);
    return this;
  }
  withEventListenerObject<K extends keyof ClientEvents>(
    listener: DiscordEventListener<K>
  ) {
    this.eventListeners.set(listener.event, listener.listener as (...args: any[]) => Awaitable<void>);
    return this;
  }
  withCommand(command: ICommandable) {
    this.commands.push(command);
    return this;
  }
}

export default Module;