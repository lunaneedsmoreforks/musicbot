import { owners } from "../../../config";
import { Command } from "../../../lib/command";


export default new Command({
  aliases: ['removeUser', 'remove'],
  name: 'removeUser',
  description: 'Remove a user from the owners list',
  usage: '+user remove <user>',
  callback: async (context) => {
    if (!context.restMessage) return;
    if (owners.includes(context.caller.id)) return;
    context.message.mentions.users.forEach((user) => {
      if (owners.includes(user.id)) owners.splice(owners.indexOf(user.id), 1);
    })
    await context.channel.send(`Removed ${context.message.mentions.users.size} users from the owners list`);   
  }
})