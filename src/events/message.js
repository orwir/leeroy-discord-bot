import features from '../features'
import { PREFIX, Server } from '../internal/config'
import { verifyBotPermissions, verifyUserPermissions } from '../internal/permissions'
import { ERROR_NOT_COMMAND, log } from '../utils/response'

export default async function (context) {
    if (context.author.bot || !context.content.trim()) {
        return
    }
    try {
        const request = {
            prefix: undefined,
            feature: undefined,
            args: []
        }
        await parsePrefix(context, request)
        await parseFeature(context, request)
        await parseArguments(context, request)
        progress(context, true)
        await verifyBotPermissions(context, request)
        await verifyUserPermissions(context, request)
        await execute(context, request)
        await clean(context)
    } catch (error) {
        log(context, error)
    } finally {
        progress(context, false)
    }
}

async function parsePrefix(context, request) {
    const config = await Server.config(context)
    if (context.content.startsWith(config.prefix)) {
        request.prefix = config.prefix
    } else if (context.content.startsWith(PREFIX)) {
        request.prefix = PREFIX
        request.stablePrefix = true
    } else {
        throw ERROR_NOT_COMMAND
    }
}

async function parseFeature(context, request) {
    const raw = context.content
    const start = request.prefix.length
    const end = raw.indexOf(' ', start) > 0 ? raw.indexOf(' ', start) : raw.length
    if (start + end > 0) {
        const name = raw.slice(start, end)
        request.feature = features[name]
        if (request.feature && !(request.stablePrefix && !request.feature.stable)) {
            return
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
}

async function execute(context, request) {
    return request.feature.execute(context, ...request.args)
}

async function clean(message) {
    return message.delete().catch({})
}

function progress(context, show) {
    if (show) {
        context.channel.startTyping()
    } else {
        context.channel.stopTyping(true)
    }
}