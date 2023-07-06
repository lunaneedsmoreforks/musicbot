import { Message } from 'discord.js-selfbot-v13';
import { exec } from 'child_process';
import { Command } from '../../command';

const shellCommand = new Command({
  "name": "shell",
  "description": "Run shell commands",
  "usage": "shell <command>",
  "aliases": ["sh", "bash", "zsh"],
  "callback": async (message: Message, args: string[]) => {
    const codeRegex = /(`{1,3})(?:(?:sh)|(?:bash))?\n?\r?((?:.|\n.(?!`))+)\n?\r?\1/g
    let data = codeRegex.exec(args.join(' '));
    console.log(data)
    let output = [] as string[];
    
    try {
      let code = data?.[2];
      if (!code) return message.channel.send("No code provided");

      output.push(exec(code, { shell: "bash", timeout: 10000 }) as unknown as string)
    } catch (e) {
      output.push(`Error: ${e}`);
    }
    

    await message.channel.send(`\`\`\`\n${output.join('\n')}\n\`\`\``);
  }
})