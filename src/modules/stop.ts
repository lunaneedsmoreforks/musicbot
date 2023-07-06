import { Message } from 'discord.js-selfbot-v13';
import { Command, CommandMessage } from '../command';

import { runningProcesses } from './shell';

const stopCommand = new Command({
  "name": "stop",
  "description": "Stops all running subprocesses",
  "usage": "stop",
  "callback": async (message: CommandMessage, args: string[]) => {
    if (runningProcesses.length === 0) {
      await message.channel.send("No running processes!");
      return;
    }

    await message.channel.send(`Stopping ${runningProcesses.length} processes...`);

    runningProcesses.forEach((p) => {
      p.kill();
    });
  }
})