const TEXT_CHANNEL_HANDLERS = []

const VOICE_CHANNEL_HANDLERS = []

export function registerVoiceChannelHandler(feature, template) {
    VOICE_CHANNEL_HANDLERS.push({ feature: feature, template: template });
}

export function voiceChannelHandlers() {
    return Object.freeze(VOICE_CHANNEL_HANDLERS);
}

export function registerTextChannelHandler(feature) {
    TEXT_CHANNEL_HANDLERS.push(feature)
}

export function textChannelHandlers() {
    return Object.freeze(TEXT_CHANNEL_HANDLERS)
}