const _register = []

export function register(feature, event, {channel, interval} = {}) {
    _register.push({
        feature: feature,
        event: event,
        channel: channel,
        interval: interval
    })
}

export function handlers() { return Object.freeze(_register) }
