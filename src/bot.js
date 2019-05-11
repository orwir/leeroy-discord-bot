const discord = require('discord.js')
const common = require('./common')
const events = require('./events')
require('./commands')

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

bot.on('raw', event => {
    const add = 'MESSAGE_REACTION_ADD'
    const remove = 'MESSAGE_REACTION_REMOVE'
    const reactions = [add, remove]
    if (reactions.includes(event.t)) {
        events.reaction(bot, event.d, add === event.t)
    }
})

bot.login(common.config.token)