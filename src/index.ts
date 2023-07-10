import { Client } from 'discord.js'

import { token, owners } from './config'
import Registry from './lib/registry';

const bot = new Registry(new Client({
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildMessages",
    "MessageContent"
  ]
}))

export default bot;

import('./modules/commands')

bot.addEventListener('ready', () => {
  if (!bot.bot!!.user) return; // This should never happen
  console.log(`Logged in as ${bot.bot!!.user?.username}!`)
  if (!owners.includes(bot.bot!!.user.id)) owners.push(bot.bot!!.user.id);
  console.log(`Owners: ${owners.join(', ')}`)
  bot.bot!!.user?.setPresence({status: "invisible", afk: true})

})

bot.login(token);
