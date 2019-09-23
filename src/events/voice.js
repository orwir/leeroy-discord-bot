import features from '../features'
import { error } from '../internal/utils'

const EVENTS = {}

export function register(template, feature) {
    EVENTS[template] = feature
}

export default async function(prevMemberState, currMemberState) {
    const call = (member, channel, method) => {
        if (!channel) {
            return
        }
        const feature = EVENTS[EVENTS.keys().find(key => channel.name.match(key))]
        if (feature) {
            
        }
    }

    if (prevMemberState.voiceChannelID !== currMemberState.voiceChannelID) {
        const left = prevMemberState.voiceChannel
        if (left && hasFeature(left.name)) {
            feature(left.name).onLeave(prevMemberState, left)
        }

        const joined = currMemberState.voiceChannel
        if (joined && hasFeature(joined.name)) {
            feature(joined.name).onJoin(currMemberState, joined)
        }
    }
}