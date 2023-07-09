import bot from "../../index";

import yt from "./yt";
import say from "./say";
import user from "./user";
import bot_ from "./bot";

bot.registerCommand(yt);
bot.registerCommand(say);
bot.registerCommand(user);
bot.registerCommand(bot_);