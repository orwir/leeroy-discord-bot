import features from '../features'
import { log } from '../utils/response'
import { Server } from '../internal/config'

const LISTENERS = []

export function register(feature, template) {
    LISTENERS.push({ feature: feature, template: template })
}

export default async function(prevMemberState, currMemberState) {
    await Server
        .language(prevMemberState)
        .then(t => {
            prevMemberState.t = t
            currMemberState.t = t
        })
        .then(() => {
            if (prevMemberState.voiceChannelID !== currMemberState.voiceChannelID) {
                return Promise.all([
                    onUserChangedChannel(prevMemberState, 'onLeave'),
                    onUserChangedChannel(currMemberState, 'onJoin')
                ])
            }
        })
        .catch(error => log(prevMemberState, error))
}

async function onUserChangedChannel(member, method) {
    if (!member.voiceChannel) {
        return
    }
    const listener = LISTENERS.find(({ template }) => template.test(member.voiceChannel.name))
    if (!listener) {
        return
    }
    return features[listener.feature][method](member, member.voiceChannel)
}