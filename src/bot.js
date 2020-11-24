import discord from 'discord.js'
import command from './events/message'
import reaction, { REACTION_ADD, REACTION_TYPES } from './events/reaction'
import voice from './events/voice'
import features from './features'
import { PREFIX, Server, TOKEN } from './internal/config'
import { textChannelHandlers } from './internal/register'

const bot = new discord.Client()

bot.on('ready', () => {
    bot.user.setPresence({
        game: {
            name: `${PREFIX}help`,
            type: 'PLAYING'
        }
    })
    console.log(`${bot.user.tag} has been started.`)
})

bot.on('message', async (msg) => {
    msg.t = await Server.language(msg)
    command(msg)
    for (const handler of textChannelHandlers()) {
        features[handler].onMessage(msg)
    }
})

bot.on('voiceStateUpdate', (prevMemberState, currMemberState) => {
    voice(prevMemberState, currMemberState)
})

bot.on('raw', event => {
    if (REACTION_TYPES.includes(event.t)) {
        reaction(bot, event.d, REACTION_ADD === event.t)
    }
})

bot.login(TOKEN)