import { ChildProcess, exec } from "child_process";
import { owners } from "../../../config";
import { Command } from "../../../lib/command";
import { Message } from "discord.js-selfbot-v13";

let processes: Map<string, ChildProcess> = new Map();

export default new Command({
  aliases: ['shell', 'sh'],
  name: 'shell',
  description: 'Run shell commands',
  usage: '+shell <command>',
  callback: async (context) => {

    context.args?.shift();

    if (!context.args) return;
  


    let output: string[] = [];
    let message: Message | null = null;
    let editTimeout: number = 500;
    let editLastTime: number = 0;

    if (context.args[0] === "stop") {
      for (const [key, value] of processes) {
        value.kill();
        processes.delete(key);
        output.push(`<Killed \`${key}\`>`);
        if (editLastTime + editTimeout < Date.now()) {
          editLastTime = Date.now();
          await updateMessage();
        }
      }
      await updateMessage();
      return;
    }

    async function updateMessage() {
      if (!message && output.length == 0) return;
      if (!message) {
        message = await context.channel.send(`\`\`\`\n${output.join('\n')}\n\`\`\``);
        return;
      }
      message.edit(`\`\`\`\n${output.join('\n')}\n\`\`\``);
    }
    
    if (!owners.includes(context.caller.id)) return;
    if (!context.args) return;

    const command = context.args.join(' ');
    output.push(`<Running \`${command}\`...>`);
    await updateMessage();

    const child = exec(command, { shell: "zsh" });

    processes.set(command, child);

    child.stdout?.on('data', (data) => {
      data.split('\n').forEach((line: string) => {
        if (line === '') return;
        output.push(line);
      });
      if (editLastTime + editTimeout < Date.now()) {
        editLastTime = Date.now();
        updateMessage();
      }
    });
    child.stderr?.on('data', (data) => {
      data.split('\n').forEach((line: string) => {
        if (line === '') return;
        output.push(line);
      });
      if (editLastTime + editTimeout < Date.now()) {
        editLastTime = Date.now();
        updateMessage();
      }
    });

    child.on('close', (code) => {
      output.push(`<Process exited with code ${code}>`);
      updateMessage();
      processes.delete(command);
    });
  }
})

export { processes }