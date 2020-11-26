import channel from "../../internal/channel.js"
import event from "../../internal/event.js"
import groups from "../../internal/groups.js"
import { register } from "../../internal/register.js"
import { path } from "../../utils/object.js"
import features from '../index.js'

register('reaction_guardian', channel.text, event.onReaction)

export default {
    name: 'reaction_guardian',
    group: groups.management,
    description: 'global.na',
    usage: 'N/A',
    examples: 'global.na',
    permissions: [],
    arguments: 0,
    exclude: true,

    [event.onReaction]: async (context, user, reacted) => {
        const field = path(context.message, 'embeds[0].fields[0]')
        if (!field || field.name !== 'feature') return
        const feature = features[field.value]
        if (!feature) return
        const allowed = feature.emojis || [context.emoji.name]

        if (reacted && !allowed.includes(context.emoji.name)) {
            await context.remove()
        }
    }
}
