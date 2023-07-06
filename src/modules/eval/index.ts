// Generate a dummy client that can listen for events
// Once the module is initialized, it will replace the bot with the actual client

import { Client, Message } from 'discord.js-selfbot-v13'
import ts from 'typescript'

import { Command } from '../../command'

var _global = {} as any;

const evalCommand = new Command({
  "name": "eval",
  "description": "Evaluate javascript",
  "usage": "eval <code>",
  "aliases": ["e"],
  "callback": async (message, args) => {
    const codeRegex = /(`{1,3})((?:js)|(?:ts))?\n?\r?((?:.|\n.(?!`))+)\n?\r?\1/g
    let data = codeRegex.exec(args.join(' '));
    console.log(data)
    let output = [] as string[];
    let cnsle = console
    console = new Proxy(cnsle, {
      get(target, prop: string, receiver) {
        if (["log", "error", "info"].includes(prop)) {
          return function () { Array.from(arguments).forEach(arg => output.push(arg.toString())); }
        }
        return Reflect.get(target, prop, receiver);
      }
    });
    try {
      let code = data?.[3];
      if (!code) return message.channel.send("No code provided");
      if (data?.[2] == "ts") code = ts.transpile(code);

      output.push(`> ${await eval(code)}`)
    } catch (e) {
      output.push(`Error: ${e}`);
    }
    console = cnsle;

    await message.channel.send(`\`\`\`js\n${output.join('\n')}\n\`\`\``);
  }
})