import features from '../features'
import { isRunning } from "../features/settings/pause"
import channel from "../internal/channel"
import { Server } from "../internal/config"
import { handlers } from "../internal/register"
import { log } from "../utils/response"

export default async function (message, event) {
    if (!message.content) return
    message.t = await Server.language(message)

    handlers()
        .filter(handler => handler.channel === channel.text && handler.event === event)
        .forEach(handler => {
            if (isRunning() || features[handler.feature].unstoppable) {
                features[handler.feature][handler.event](message).catch(error => log(message, error))
            }
        })
}
