import { Message } from 'discord.js-selfbot-v13';
import { Command, CommandMessage } from '../command';

import { processes } from './commands/shell';

const stopCommand = new Command({
  "name": "stop",
  "description": "Stops all running subprocesses",
  "usage": "stop",
  "callback": async (message: CommandMessage, args: string[]) => {
    if (processes.size === 0) {
      await message.channel.send("No running processes!");
      return;
    }

    await message.channel.send(`Stopping ${processes.size} processes...`);

    processes.forEach((p) => {
      p.kill();
    });
  }
})