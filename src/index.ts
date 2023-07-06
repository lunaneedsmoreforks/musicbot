import { Client } from 'discord.js-selfbot-v13'

import { token, owners } from './config'

const bot = new Client({
  checkUpdate: false
})

export default bot;

import('./modules')

bot.on('ready', () => {
  if (!bot.user) return; // This should never happen
  console.log(`Logged in as ${bot.user?.username}!`)
  if (!owners.includes(bot.user.id)) owners.push(bot.user.id);
  console.log(`Owners: ${owners.join(', ')}`)
})

bot.login(token);