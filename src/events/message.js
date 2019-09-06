import '../internal/extensions'
import { Server } from '../internal/config'
import features from '../features'

async function parsePrefix(msg, builder) {
    const prefix = await Server.prefix(msg.guild)
    if (msg.content.startsWith(prefix)) {
        builder.prefix = prefix
        return true
    }
    return false
}

async function parseFeature(msg, builder) {
    const raw = msg.content
    const start = builder.prefix.length
    const end = raw.indexOf(' ', start) > 0 ? raw.indexOf(' ', start) : raw.length
    if (start + end > 0) {
        const name = raw.slice(start, end)
        builder.feature = features[name]
        return builder.feature != null
    }
    return false
}

async function parseArguments(msg, builder) {
    let rawargs = msg.content.slice(`${builder.prefix}${builder.feature.name} `.length)
    if (rawargs.isBlank()) {
        return
    }
    if (!builder.feature.arguments) {
        builder.args.push(...rawargs.trim().split(' '))

    } else {
        for (let i = 1; i <= builder.feature.arguments && rawargs.length > 0; i++) {
            let arg
            if (i < builder.feature.arguments) {
                let index = rawargs.indexOf(' ')
                arg = rawargs.slice(0, index > 0 ? index : rawargs.length)
                rawargs = rawargs.slice(arg.length + 1)
            } else {
                arg = rawargs
            }
            builder.args.push(arg)
        }
    }
}

export default async function (msg) {
    if (msg.author.bot || msg.content.isBlank()) {
        return
    }
    const request = {
        prefix: undefined,
        feature: undefined,
        args: []
    }
    if (!(await parsePrefix(msg, request))) {
        return
    }
    if (!(await parseFeature(msg, request))) {
        return
    }
    await parseArguments(msg, request)
    //TODO: check bot has permissions
    //TODO: check user has permissions
    request.feature
        .handle(msg, ...request.args)
        .catch(error => console.log(error))
}