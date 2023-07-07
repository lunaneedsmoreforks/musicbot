import { Client } from 'discord.js-selfbot-v13'

import { token, owners } from './config'
import RegistryClass from './lib/registry';

const bot = new RegistryClass(new Client({
  checkUpdate: false
}))

export default bot;

import('./modules')
import('./modules/commands')

bot.addEventListener('ready', () => {
  if (!bot.bot!!.user) return; // This should never happen
  console.log(`Logged in as ${bot.bot!!.user?.username}!`)
  if (!owners.includes(bot.bot!!.user.id)) owners.push(bot.bot!!.user.id);
  console.log(`Owners: ${owners.join(', ')}`)
})

bot.login(token);
bot.bot!!.user?.setPresence({afk: true})