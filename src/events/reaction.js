import features from '../features/index.js'
import { isRunning } from '../features/settings/pause.js'
import channel from '../internal/channel.js'
import { Server } from '../internal/config.js'
import event from '../internal/event.js'
import { handlers } from '../internal/register.js'
import { log } from '../utils/response.js'

export default async function reaction(reaction, user, reacted) {
    const filter = (handler) => handler.channel === channel.text && handler.event === event.onReaction

    try {
        if (user.bot) return
        reaction.t = await Server.language(reaction.message.guild)
        for (const handler of handlers().filter(filter)) {
            if (isRunning() || features[handler.feature].unstoppable) {
                await features[handler.feature][handler.event](reaction, user, reacted)
                    .catch(error => log(reaction, error))
            }
        }
    } catch (error) {
        log(reaction, error)
    }
}
