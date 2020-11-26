import features from '../features'
import { isRunning } from '../features/settings/pause'
import channel from '../internal/channel'
import { Server } from '../internal/config'
import event from '../internal/event'
import { handlers } from '../internal/register'
import { log } from '../utils/response'

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