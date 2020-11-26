import discord from 'discord.js'
import message from './events/message.js'
import raw from './events/raw.js'
import reaction from './events/reaction.js'
import ready from './events/ready.js'
import voice from './events/voice.js'
import { TOKEN } from './internal/config.js'
import event from './internal/event.js'

console.log('Initializing bot...')

const bot = new discord.Client()

bot.on('ready', () => ready(bot))
bot.on('message', (context) => message(context, event.onMessage))
bot.on('voiceStateUpdate', (previous, current) => voice(previous, current))
bot.on('messageReactionAdd', (context, user) => reaction(context, user, true))
bot.on('messageReactionRemove', (context, user) => reaction(context, user, false))
bot.on('raw', (event) => raw(bot, event))

bot.login(TOKEN)