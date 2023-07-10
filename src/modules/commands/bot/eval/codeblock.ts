import { Awaitable, Message } from "discord.js";
import { CommandContext } from "../../../../lib/command";
import { runInNodeEnv } from "./node";
import ts from "typescript";
import { executePythonCode } from "./python";

export async function tryParseCodeblock(context: CommandContext): Promise<boolean> {

  let output: string[] = [];
  let message: Message | null = null;
  let editTimeout: number = 500;
  let editLastTime: number = 0;

  async function updateMessage() {
    output = output.filter((v, i, a) => v != undefined && v != null && v?.trim() != "")
    if (!message && output.length == 0) return;
    if (!message) {
      message = await context.channel.send(`\`\`\`\n${output.join('\n')}\n\`\`\``);
      return;
    }
    message.edit(`\`\`\`\n${output.join('\n')}\n\`\`\``);
  }
  async function maybeUpdate() {
    if (editLastTime + editTimeout < Date.now()) {
      editLastTime = Date.now();
      await updateMessage();
    }
  }


  if (!context.restMessage) return false;
  let code = context.restMessage.trim();
  if (code.startsWith('\n')) code = code.slice(1);
  const codeRegex = /.+(`{1,3})(\w+)?\n?\r?((?:.|\n(?:.|\n)(?!`))+)\n?\r?\1/g
  let data = codeRegex.exec(code);
  if (!data && !context.restMessage.replace("eval", "").trim()) return false;
  if (!data) {
    // @ts-ignore
    data = ["", "", "js", code.split("eval ").slice(1).join("eval ")];
  }
  switch (data!![2]) {
    case "js":
    case "javascript":
      try {
        if (context.message.deletable) await context.message.delete();
        output.push( await runInNodeEnv(data!![3], {
          context
        }, (add) => {
          output.push(add);
          maybeUpdate();
        }));
        await updateMessage();
      } catch (error) {
        context.channel.send(`\`\`\`js\n${error}\n\`\`\``);
        
      } finally {
        return true;
      }
    case "ts":
    case "typescript":
      try {
        if (context.message.deletable) await context.message.delete();
        await runInNodeEnv(ts.transpile(data!![3]), {
          context
        });
      } catch (error) {
        context.channel.send(`\`\`\`js\n${error}\n\`\`\``);
      } finally {
        return true;
      }

    case "py":
    case "python":
      try {
        let lambda = (line: string) => {
          output.push(line);
          maybeUpdate();
        }
        if (context.message.deletable) await context.message.delete();
        await executePythonCode(data!![3], lambda, lambda);
      } catch (error) {
        context.channel.send(`\`\`\`js\n${error}\n\`\`\``);
      } finally {
        return true;
      }
    default:

      break;
  }
  return true;

}