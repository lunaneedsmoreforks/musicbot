import { Command } from "../../../lib/command";


export default new Command({
  aliases: ['ping'],
  name: 'ping',
  description: 'Ping the bot',
  usage: '+ping',
  callback: async (context) => {
    let now = Date.now();
    let m = await context.channel.send(`Pong! 
    Gateway (Receiving): ${context.bot.ws.ping}ms
    Rest (Sending): ...`);
    await m.edit(`Pong!
    Gateway (Receiving): ${context.bot.ws.ping}ms
    Rest (Sending): ${Date.now() - now}ms`);
  }
})