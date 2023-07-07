import { WebEmbed } from "discord.js-selfbot-v13";
import { Command } from "../../../lib/command";

export default new Command({
  aliases: ['info', 'i'],
  name: 'info',
  description: 'Get info about a user',
  usage: '+user info <user>',
  callback: async (context) => {
    let embed = new WebEmbed()
    let user = context.message.mentions.users.first() || context.caller;
    if (user.discriminator === "0") {
      embed.setAuthor({
        name: `${user.username}`,
        iconURL: user.displayAvatarURL({ dynamic: true })
      });
    } else {
      embed.setAuthor({
        name: `${user.username}#${user.discriminator}`,
        iconURL: user.displayAvatarURL({ dynamic: true })
      });
    }
    embed.setDescription(`
    **ID:** ${user.id}
    **Bot:** ${user.bot ? "Yes" : "No"}
    **Created:** ${user.createdAt.toDateString()}
    `)
    await context.channel.send({embeds: [embed]});


  }
})