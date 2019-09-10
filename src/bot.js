import { TOKEN, PREFIX } from './internal/config'
import discord from 'discord.js'
import message from './events/message'
import reaction, { REACTION_TYPES, REACTION_ADD } from './events/reaction'

const bot = new discord.Client()

bot.on('ready', () => {
    bot.user.setPresence({
        game: {
            name: `${PREFIX}help`,
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

console.log(TOKEN)

bot.login(TOKEN)