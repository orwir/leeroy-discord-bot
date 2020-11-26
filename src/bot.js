import discord from 'discord.js'
import message from './events/message'
import raw from './events/raw'
import reaction from './events/reaction'
import ready from './events/ready'
import voice from './events/voice'
import { TOKEN } from './internal/config'
import event from './internal/event'

console.log('Initializing bot...')

const bot = new discord.Client()

bot.on('ready', () => ready(bot))
bot.on('message', (context) => message(context, event.onMessage))
bot.on('voiceStateUpdate', (previous, current) => voice(previous, current))
bot.on('messageReactionAdd', (context, user) => reaction(context, user, true))
bot.on('messageReactionRemove', (context, user) => reaction(context, user, false))
bot.on('raw', (event) => raw(bot, event))

bot.login(TOKEN)