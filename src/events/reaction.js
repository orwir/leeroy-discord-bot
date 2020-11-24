import features from '../features'
import { Server } from '../internal/config'
import { path } from '../utils/object'
import { log } from '../utils/response'

export const REACTION_ADD = 'MESSAGE_REACTION_ADD'
export const REACTION_REMOVED = 'MESSAGE_REACTION_REMOVE'
export const REACTION_TYPES = [REACTION_ADD, REACTION_REMOVED]

const FEATURE_PATH = 'embeds[0].fields[0]'

export default async function (bot, data, reacted) {
    const user = bot.users.get(data.user_id)
    if (!user) {
        return
    }
    const emoji = data.emoji.name
    const channel = bot.channels.get(data.channel_id)
    const context = await channel.fetchMessage(data.message_id).catch(error => null)
    if (!context) {
        return
    }
    if (user.bot || context.author.id !== bot.user.id) {
        return
    }
    if (path(context, `${FEATURE_PATH}.name`) !== 'feature') {
        return
    }
    const feature = features[path(context, `${FEATURE_PATH}.value`)]
    if (!feature) {
        return
    }
    
    const member = context.guild.member(user)
    if (reacted && !feature.emojis.includes(emoji)) {
        await context.reactions
            .find(reaction => reaction.emoji.name === emoji)
            .remove(member)
            .catch(error => log(context, error))
    } else {
        await Server
            .language(context)
            .then(language => { context.t = language })
            .then(() => feature.react(context, emoji, member, reacted))
            .catch(error => log(context, error))
    }
}