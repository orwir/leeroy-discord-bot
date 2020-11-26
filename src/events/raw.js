import { MessageReaction } from "discord.js"
import { log } from "../utils/response.js"

export default async function (bot, event) {
    if (['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(event.t)) {
        onReaction(bot, event).catch(error => log(bot, error))
    }
}

async function onReaction(bot, event) {
    const channel = await bot.channels.fetch(event.d.channel_id)
    if (channel.messages.cache.has(event.d.message_id)) {
        return
    }
    const message = await channel.messages.fetch(event.d.message_id)
    if (!message) return
    const user = await bot.users.fetch(event.d.user_id)
    if (!user) return
    const snowflake = event.d.emoji.id ? `${event.d.emoji.name}:${event.d.emoji.id}` : event.d.emoji.name
    const reaction = message.reactions.resolve(snowflake) || new MessageReaction(bot, event.d, message)
    const type = event.t === 'MESSAGE_REACTION_ADD' ? 'messageReactionAdd' : 'messageReactionRemove'
    bot.emit(type, reaction, user)
}
