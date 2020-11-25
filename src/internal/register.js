const _register = []

export function register(feature, channel, event) {
    _register.push({
        feature: feature,
        channel: channel,
        event: event
    })
}

export function handlers() {
    return Object.freeze(_register)
}