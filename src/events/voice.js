import features from '../features'
import { log } from '../internal/utils'

const LISTENERS = []

export function register(feature, template) {
    LISTENERS.push({ feature: feature, template: template })
}

export default async function(prevMemberState, currMemberState) {
    if (prevMemberState.voiceChannelID !== currMemberState.voiceChannelID) {

        onUserChangedChannel(prevMemberState, prevMemberState.voiceChannel, 'onLeave')
            .catch(error => log(prevMemberState, error))
        
        onUserChangedChannel(currMemberState, currMemberState.voiceChannel, 'onJoin')
            .catch(error => log(currMemberState, error))
    }
}

async function onUserChangedChannel(member, channel, method) {
    if (!channel) {
        return
    }
    const listener = LISTENERS.find(({ template }) => template.test(channel.name))
    if (!listener) {
        return
    }
    return features[listener.feature][method](member, channel)
}