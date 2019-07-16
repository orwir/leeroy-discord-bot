import { token } from './internal/config.mjs'
import discord from 'discord.js'
// import { message, reaction } from './events'

const bot = new discord.Client()

// bot.on('ready', () => {
//     bot.user.setPresence({
//         game: {
//             name: 'e!wtf',
//             type: 'PLAYING'
//         }
//     })
// })

// bot.on('message', message)

// bot.on('raw', event => {
//     if (['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(event.t)) {
//         reaction(bot, event.d, 'MESSAGE_REACTION_ADD' === event.t)
//     }
// })

bot.login(token)