import '../internal/extensions'
import features from '../features'

const FEATURE_PATH = 'embeds[0].fields[0]'

export const REACTION_ADD = 'MESSAGE_REACTION_ADD'
export const REACTION_REMOVED = 'MESSAGE_REACTION_REMOVE'
export const REACTION_TYPES = [REACTION_ADD, REACTION_REMOVED]

export default async function (bot, data, reacted) {
    const user = bot.users.get(data.user_id)
    const channel = bot.channels.get(data.channel_id)
    const msg = await channel.fetchMessage(data.message_id)
    if (user.bot || msg.author.id !== bot.user.id) {
        return
    }
    if (msg.path(`${FEATURE_PATH}.name`) !== 'feature') {
        return
    }
    const feature = features[msg.path(`${FEATURE_PATH}.value`)]
    if (!feature) {
        return
    }
    const emoji = data.emoji.name
    const member = msg.guild.member(user)
    if (reacted && !feature.emojis.includes(emoji)) {
        msg.reactions
            .find(reaction => reaction.emoji.name === emoji)
            .remove(member)
    } else {
        feature.react(msg, emoji, member, reacted)
            .catch(error => console.log(error))
    }
}