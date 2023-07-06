import { Message, PartialMessage } from "discord.js-selfbot-v13";

import bot from '../index'
import { Command } from "../command";

var oldMessageContents: any = {};

let fakeNitroEnabled = true;


async function parseFakeNitro(message: Message) {
  if (!fakeNitroEnabled) return;
  if (message.author.id !== bot.user?.id) return;
  
  // Match discord emoji
  const emojiRegex = /:\w+:/g;
  const emojiMatches = message.content.match(emojiRegex);
  if (emojiMatches) {
    let newContent = message.content;
    emojiMatches.forEach(async (match) => {
      // Get emoji name
      const emojiName = match.slice(1, -1);
      // Get emoji
      bot.emojis.cache.forEach((emoji) => {
        if (emoji.name === emojiName) {
          newContent = newContent.replaceAll(match, `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}?quality=lossless&name=${emoji.name}&size=48`);
        }
      })
      if (newContent !== message.content) {
        oldMessageContents[message.id] = message.content;
        message.edit(newContent);
      }
    })
  }
}

bot.on('messageCreate', parseFakeNitro);


bot.on('messageDelete', async (message) => {
  if (oldMessageContents[message.id]) delete oldMessageContents[message.id];
})

bot.on('messageReactionAdd', async (reaction, user) => {
  // Revert the fakenitro message if the user reacts with ❌, ❎ or ✖
  if (!oldMessageContents[reaction.message.id]) return;
  if (reaction.message.partial) reaction.message = await reaction.message.fetch();
  if (reaction.message.author.id !== bot.user?.id) return;
  if (['❌', '❎', '✖'].includes(reaction.emoji.name|| '')) {
    await reaction.message.edit(oldMessageContents[reaction.message.id]);
    delete oldMessageContents[reaction.message.id];
    reaction.remove();
  }
})


const fakeNitroCommand = new Command({
  "name": "fakenitro",
  "description": "Toggle fakenitro",
  "usage": "fakenitro [on|off]",
  "aliases": ["fn"],
  "callback": async (message, args) => {
    if (!args[0]) {
      message.edit(`Fakenitro is currently ${fakeNitroEnabled ? "enabled" : "disabled"}`);
      return;
    }

    if (args[0].toLowerCase() === 'toggle') {
      args[0] = (!fakeNitroEnabled).toString()
    }

    if (['on', 'true', 'enable'].includes(args[0].toLowerCase())) {
      fakeNitroEnabled = true;
      message.edit("Fakenitro enabled");
    } else if (['off', 'false', 'disable'].includes(args[0].toLowerCase())) {
      fakeNitroEnabled = false;
      message.edit("Fakenitro disabled");
    } else {
      message.edit("Invalid argument");
    }

    setTimeout(message.delete, 5000)
  }
})