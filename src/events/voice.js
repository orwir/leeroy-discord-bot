import features from "../features"
import { isRunning } from "../features/settings/pause"
import channel from "../internal/channel"
import { Server } from "../internal/config"
import event from "../internal/event"
import { handlers } from "../internal/register"
import { log } from "../utils/response"

export default async function(previous, current) {
    await Server.language(previous).then(t => {
        previous.t = t
        current.t = t
    })
    
    handlers()
        .filter(handler => handler.channel === channel.voice)
        .forEach(handler => {
            if (isRunning() || features[handler.feature].unstoppable) {
                handleMovement(handler, previous, current).catch(error => log(previous, error))
            }
        })
}

async function handleMovement(handler, previous, current) {
    if (previous.voiceChannelID === current.voiceChannelID) return
    if (![event.onJoinVoice, event.onLeaveVoice].includes(handler.event)) return

    const member = handler.event === event.onJoinVoice ? current : previous
    if (member.voiceChannelID) {
        await features[handler.feature][handler.event](member)
    }
}