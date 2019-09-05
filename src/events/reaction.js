import '../internal/extensions'
import features from '../features'

const FEATURE_PATH = 'embeds[0].fields[0]'

export const REACTION_ADD = 'MESSAGE_REACTION_ADD'
export const REACTION_REMOVED = 'MESSAGE_REACTION_REMOVE'
export const REACTION_TYPES = [REACTION_ADD, REACTION_REMOVED]

export default async function (bot, data, reacted) {
    const channel = bot.channels.get(data.channel_id)
    const msg = await channel.fetchMessage(data.message_id)
    if (msg.author.id !== bot.user.id) {
        return
    }
    if (msg.path(`${FEATURE_PATH}.name`) !== 'feature') {
        return
    }
    const emoji = data.emoji.name
    const author = msg.guild.member(bot.users.get(data.user_id))
    if (author.bot) {
        return
    }
    const feature = features[msg.path(`${FEATURE_PATH}.value`)]
    if (!feature) {
        return
    }
    if (reacted && !feature.emojis.includes(emoji)) {
        msg.reactions
            .find(reaction => reaction.emoji.name === emoji)
            .remove(author)
    } else {
        feature.react(msg, emoji, author, reacted)
            .catch(error => console.log(error))
    }
}