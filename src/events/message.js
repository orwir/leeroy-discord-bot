import { Server, PREFIX } from '../internal/config'
import features from '../features'
import { verifyBotPermissions, verifyUserPermissions } from '../internal/permissions'
import { log, ERROR_NOT_COMMAND } from '../internal/utils'

export default async function (context) {
    if (context.author.bot || !context.content.trim()) {
        return
    }
    await Promise.resolve({
            prefix: undefined,
            feature: undefined,
            args: []
        })
        .then(request => parsePrefix(context, request))
        .then(request => parseFeature(context, request))
        .then(request => parseArguments(context, request))
        .then(request => updateContext(context, request))
        .then(request => verifyBotPermissions(context, request))
        .then(request => verifyUserPermissions(context, request))
        .then(request => execute(context, request))
        .then(request => clean(context, request))
        .catch(error => log(context, error))
}

async function parsePrefix(context, request) {
    const config = await Server.config(context)
    const prefix = config.prefix
    if (context.content.startsWith(prefix)) {
        request.prefix = prefix
        return request
    } else if (context.content.startsWith(PREFIX)) {
        request.prefix = PREFIX
        request.stablePrefix = true
        return request
    }
    throw ERROR_NOT_COMMAND
}

async function parseFeature(context, request) {
    const raw = context.content
    const start = request.prefix.length
    const end = raw.indexOf(' ', start) > 0 ? raw.indexOf(' ', start) : raw.length
    if (start + end > 0) {
        const name = raw.slice(start, end)
        request.feature = features[name]
        if (request.feature && !(request.stablePrefix && !request.feature.stable)) {
            return request
        }
    }
    throw ERROR_NOT_COMMAND
}

async function parseArguments(context, request) {
    let rawargs = context.content.slice(`${request.prefix}${request.feature.name} `.length)
    if (!rawargs.trim()) {
        // do nothing

    } else if (!request.feature.arguments) {
        request.args.push(...rawargs.trim().split(' '))

    } else {
        for (let i = 1; i <= request.feature.arguments && rawargs.length > 0; i++) {
            let arg
            if (i < request.feature.arguments) {
                let index = rawargs.indexOf(' ')
                arg = rawargs.slice(0, index > 0 ? index : rawargs.length)
                rawargs = rawargs.slice(arg.length + 1)
            } else {
                arg = rawargs
            }
            request.args.push(arg)
        }
    }
    return request
}

async function updateContext(context, request) {
    context.t = await Server.language(context)
    return request
}

async function execute(context, request) {
    return request.feature
        .execute(context, ...request.args)
        .then(() => request)
}

async function clean(context, request) {
    return context.delete()
}