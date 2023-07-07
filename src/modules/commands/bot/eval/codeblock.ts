import { Awaitable } from "discord.js-selfbot-v13";
import { CommandContext } from "../../../../lib/command";

export async function tryParseCodeblock(context: CommandContext): Promise<boolean> {
  if (!context.restMessage) return false;
  let code = context.restMessage;
  const codeRegex = /(`{1,3})(\w+)?\n?\r?((?:.|\n.(?!`))+)\n?\r?\1/g
  let data = codeRegex.exec(code);
  if (!data) return false;
  switch (data[2]) {
    case "js":
    case "javascript":
      
      break;
    case "ts":
    case "typescript":

      break;

    case "py":
    case "python":

      break;
    default:

      break;
  }
  return true;

}