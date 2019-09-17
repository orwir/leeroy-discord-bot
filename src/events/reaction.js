import '../internal/extensions'
import features from '../features'
import { Server } from '../internal/config'
import { log } from '../internal/utils'

export const REACTION_ADD = 'MESSAGE_REACTION_ADD'
export const REACTION_REMOVED = 'MESSAGE_REACTION_REMOVE'
export const REACTION_TYPES = [REACTION_ADD, REACTION_REMOVED]

export default async function (bot, data, reacted) {
    const user = bot.users.get(data.user_id)
    const channel = bot.channels.get(data.channel_id)
    const context = await channel.fetchMessage(data.message_id)
    if (user.bot || context.author.id !== bot.user.id) {
        return
    }
    if (context.path(`${FEATURE_PATH}.name`) !== 'feature') {
        return
    }
    const feature = features[context.path(`${FEATURE_PATH}.value`)]
    if (!feature) {
        return
    }
    const emoji = data.emoji.name
    const member = context.guild.member(user)
    if (reacted && !feature.emojis.includes(emoji)) {
        context.reactions
            .find(reaction => reaction.emoji.name === emoji)
            .remove(member)
    } else {
        context.t = await Server.language(context.guild)
        await feature
            .react(context, emoji, member, reacted)
            .catch(error => log(context, error))
    }
}

const FEATURE_PATH = 'embeds[0].fields[0]'