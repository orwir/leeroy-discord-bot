const discord = require('discord.js')
const config = require('./internal/config')
const events = require('./events')

const bot = new discord.Client()

bot.on('ready', () => {
    bot.user.setPresence({
        game: {
            name: 'e!wtf',
            type: 'PLAYING'
        }
    })
})

bot.on('message', events.message)

// bot.on('raw', event => {
//     if (['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(event.t)) {
//         events.reaction(bot, event.d, 'MESSAGE_REACTION_ADD' === event.t)
//     }
// })

bot.login(config.token)