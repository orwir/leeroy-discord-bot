import { token } from './internal/config.mjs'
import discord from 'discord.js'
import message from './events/message.mjs'
import reaction, { REACTION_TYPES, REACTION_ADD } from './events/reaction.mjs'

const bot = new discord.Client()

bot.on('ready', () => {
    bot.user.setPresence({
        game: {
            name: 'e!wtf',
            type: 'PLAYING'
        }
    })
})

bot.on('message', message)

bot.on('raw', event => {
    if (REACTION_TYPES.includes(event.t)) {
        reaction(bot, event.d, REACTION_ADD === event.t)
    }
})

bot.login(token)