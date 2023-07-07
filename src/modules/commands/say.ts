import { DMChannel, PartialGroupDMChannel } from "discord.js-selfbot-v13";
import { owners } from "../../config";
import { Command } from "../../lib/command";


export default new Command({
  aliases: ['say'],
  name: 'say',
  description: 'Make the bot say something',
  usage: '+say <message>',
  callback: async (context) => {
    if (!context.restMessage) return;
    if (!owners.includes(context.caller.id)) return;
    if (context.message.deletable) await context.message.delete();
    await context.channel.send(context.restMessage);
    
    // @ts-ignore
    let channelName: string = context.channel instanceof (DMChannel) ? context.channel.recipient.username : context.channel.name;
    console.log(`${context.caller.username} made you say "${context.restMessage}" in ${channelName}`)
  }
})