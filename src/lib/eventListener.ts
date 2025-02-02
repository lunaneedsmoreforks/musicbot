import { ClientEvents } from "discord.js";


class DiscordEventListener<K extends keyof ClientEvents> {
  event: K;
  listener: (...args: ClientEvents[K]) => void;
  constructor({ event, listener }: { event: K, listener: (...args: ClientEvents[K]) => void}) {
    this.event = event;
    this.listener = listener;
  }
}

export { DiscordEventListener }