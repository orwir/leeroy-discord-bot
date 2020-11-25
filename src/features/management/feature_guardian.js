import channel from "../../internal/channel"
import event from "../../internal/event"
import groups from "../../internal/groups"
import { register } from "../../internal/register"
import { path } from "../../utils/object"
import features from '../index'

register('feature_guardian', channel.text, event.onReaction)

export default {
    name: 'feature_guardian',
    group: groups.management,
    description: 'global.na',
    usage: 'N/A',
    examples: 'global.na',
    permissions: [],
    arguments: 0,
    exclude: true,

    [event.onReaction]: async (context, user, reacted) => {
        const field = path(context.message, 'embeds[0].fields[0]')
        if (field.name !== 'feature') return
        const feature = features[field.value]
        if (!feature) return
        const allowed = feature.emojis || [context.emoji.name]

        if (reacted && !allowed.includes(context.emoji.name)) {
            await context.remove()
        }
    }
}
