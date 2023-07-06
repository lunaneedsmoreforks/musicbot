import bot from "../index";
import { Command } from "../command";



// Ping System
let pingIds: { [key: string]: number } = {}
const pingCommand = new Command({
  "name": "ping",
  "description": "Get the bot's ping",
  "usage": "ping",
  callback: async (message) => {
    pingIds[message.id] = Date.now();
    await message.edit("Pong!");
  }
})
bot.on('messageUpdate', async (_message, message) => {
  if (!pingIds[message.id]) return;
  if (message.partial) message = await message.fetch();
  await message.edit(`Pong! (⬇${pingIds[message.id] - message.createdTimestamp}ms ⬆${message.editedTimestamp ? message.editedTimestamp - pingIds[message.id] : '?'}ms)`);
  delete pingIds[message.id];
})
