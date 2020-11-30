import features from '../features/index.js'
import { isRunning } from "../features/settings/pause.js"
import channel from "../internal/channel.js"
import { Server } from "../internal/config.js"
import { handlers } from "../internal/register.js"
import { log } from "../utils/response.js"

export default async function (message, event) {
    const filter = (handler) => handler.channel === channel.text && handler.event === event

    try {
        if (!(message.content || '').trim()) return
        message.t = await Server.language(message.guild)
        for (const handler of handlers().filter(filter)) {
            if (isRunning() || features[handler.feature].unstoppable) {
                await features[handler.feature][handler.event](message).catch(error => log(message, error))
            }
        }
    } catch (error) {
        log(message, error)
    }
}
