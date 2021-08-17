import features from "../features/index.js"
import { isRunning } from "../features/settings/pause.js"
import channel from "../internal/channel.js"
import { Server } from "../internal/config.js"
import event from "../internal/event.js"
import { handlers } from "../internal/register.js"
import { log } from "../utils/response.js"

export default async function(previous, current) {
    const filter = (handler) => handler.channel === channel.voice

    try {
        const language = await Server.language(previous.guild)
        previous.t = language
        current.t = language
        
        for (const handler of handlers().filter(filter)) {
            if (isRunning() || features[handler.feature].unstoppable) {
                await handleMovement(handler, previous, current).catch(error => log(previous, error))
            }
        }
    } catch (error) {
        log(previous, error)
    }
}

async function handleMovement(handler, previous, current) {
    if (previous.channelID === current.channelID) return
    if (![event.onJoinVoice, event.onLeaveVoice].includes(handler.event)) return

    const context = handler.event === event.onJoinVoice ? current : previous
    if (context.channelID) {
        await features[handler.feature][handler.event](context)
    }
}