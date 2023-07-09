import { owners } from "../../../../config";
import { Command } from "../../../../lib/command";
import { tryParseCodeblock } from "./codeblock";


export default new Command({
  aliases: ['eval'],
  name: 'eval',
  description: 'Evaluate code',
  usage: '+eval <code>',
  callback: async (context) => {
    if (!owners.includes(context.message.author.id)) {
      console.log('no perms')
      return;
    }
    if (!context.restMessage) {
      await context.channel.send('Please provide some code to evaluate.')
      return;
    }
    if (await tryParseCodeblock(context)) {};
    

  }
})