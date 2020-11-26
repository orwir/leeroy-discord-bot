import features from '../features/index.js'
import { isRunning } from '../features/settings/pause.js'
import channel from '../internal/channel.js'
import { Server } from '../internal/config.js'
import event from '../internal/event.js'
import { handlers } from '../internal/register.js'
import { log } from '../utils/response.js'

export default async function reaction(context, user, reacted) {
    if (user.bot) return
    context.t = await Server.language(context.message)

    handlers()
        .filter(handler => handler.channel === channel.text && handler.event === event.onReaction)
        .forEach(handler => {
            if (isRunning() || features[handler.feature].unstoppable) {
                features[handler.feature][handler.event](context, user, reacted).catch(error => log(context.message, error))
            }
        })
}