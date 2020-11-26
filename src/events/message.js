import features from '../features/index.js'
import { isRunning } from "../features/settings/pause.js"
import channel from "../internal/channel.js"
import { Server } from "../internal/config.js"
import { handlers } from "../internal/register.js"
import { log } from "../utils/response.js"

export default async function (message, event) {
    if (!(message.content || '').trim()) return
    message.t = await Server.language(message)

    handlers()
        .filter(handler => handler.channel === channel.text && handler.event === event)
        .forEach(handler => {
            if (isRunning() || features[handler.feature].unstoppable) {
                features[handler.feature][handler.event](message).catch(error => log(message, error))
            }
        })
}
