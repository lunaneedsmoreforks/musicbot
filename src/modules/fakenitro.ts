import { Message } from "discord.js-selfbot-v13";

import bot from '../index'

bot.on('messageCreate', async (message: Message) => {
  if (message.author.id !== bot.user?.id) return;
  
  // Match discord emoji
  const emojiRegex = /:\w+:/g;
  const emojiMatches = message.content.match(emojiRegex);
  console.log(emojiMatches)
  if (emojiMatches) {
    let newContent = message.content;
    console.log(emojiMatches);
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
        message.edit(newContent);
      }
    })
  }
})