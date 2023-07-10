import { owners } from "../../../config";
import { Command } from "../../../lib/command";

export default new Command({
  aliases: ['addUser', 'add'],
  name: 'addUser',
  description: 'Add a user to the owners list',
  usage: '+user add <user>',
  callback: async (context) => {
    if (!context.restMessage) return;
    if (!owners.includes(context.caller.id)) return;
    context.message.mentions.users.forEach((user) => {
      if (!owners.includes(user.id)) owners.push(user.id);
    })
    await context.channel.send(`Added ${context.message.mentions.users.size} users to the owners list`);
  }
})