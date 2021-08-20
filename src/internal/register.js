const _register = []

export function register(feature, event, { channel, schedule } = {}) {
    _register.push({
        feature: feature,
        event: event,
        channel: channel,
        schedule: schedule
    })
}

export function handlers() { return Object.freeze(_register) }
