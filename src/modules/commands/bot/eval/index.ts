import { Command } from "../../../../lib/command";


export default new Command({
  aliases: ['eval'],
  name: 'eval',
  description: 'Evaluate code',
  usage: '+eval <code>',
  callback: async (context) => {
     
  }
})