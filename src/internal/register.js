const _register = []

export function register(feature, event, channel) {
    _register.push({
        feature: feature,
        event: event,
        channel: channel
    })
}

export function handlers() { return Object.freeze(_register) }
