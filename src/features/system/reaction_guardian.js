import channel from "../../internal/channel.js"
import event from "../../internal/event.js"
import groups from "../../internal/groups.js"
import P from '../../internal/permissions.js'
import { register } from "../../internal/register.js"
import { isAllowedEmoji } from '../../utils/emoji.js'
import { resolve } from '../index.js'

register('reaction_guardian', event.onReaction, channel.text)

export default {
    name: 'reaction_guardian',
    group: groups.system,
    description: 'global.na',
    usage: 'N/A',
    examples: 'global.na',
    permissions: [P.ADMINISTRATOR],

    [event.onReaction]: async (reaction, user, reacted) => {
        if (!reacted) return
        const feature = resolve(reaction.message)
        if (!feature) return
        if (!isAllowedEmoji(feature, reaction.message, reaction.emoji)) {
            await reaction.remove()
        }
    }
}
