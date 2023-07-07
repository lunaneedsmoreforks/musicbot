import bot from "../../index";

import shell from "./shell";
import yt from "./yt";
import say from "./say";
import user from "./user";
import bot_ from "./bot";

bot.registerCommand(shell);
bot.registerCommand(yt);
bot.registerCommand(say);
bot.registerCommand(user);
bot.registerCommand(bot_);