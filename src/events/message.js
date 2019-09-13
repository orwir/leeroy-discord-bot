import '../internal/extensions'
import { Server } from '../internal/config'
import features from '../features'
import { verifyBotPermissions, verifyUserPermissions, MISSING_PERMISSIONS } from '../internal/permissions'

const NOT_COMMAND = "NOT_COMMAND"
const IGNORE = [NOT_COMMAND, MISSING_PERMISSIONS]

async function parsePrefix(msg, request) {
    const prefix = await Server.prefix(msg.guild)
    if (msg.content.startsWith(prefix)) {
        request.prefix = prefix
        return request
    }
    throw NOT_COMMAND
}

async function parseFeature(msg, request) {
    const raw = msg.content
    const start = request.prefix.length
    const end = raw.indexOf(' ', start) > 0 ? raw.indexOf(' ', start) : raw.length
    if (start + end > 0) {
        const name = raw.slice(start, end)
        request.feature = features[name]
        return request
    }
    throw NOT_COMMAND
}

async function parseArguments(msg, request) {
    let rawargs = msg.content.slice(`${request.prefix}${request.feature.name} `.length)
    if (rawargs.isBlank()) {
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

async function handleError(error) {
    if (IGNORE.includes(error)) {
        return
    }
    console.log(error)
}

export default async function (msg) {
    if (msg.author.bot || msg.content.isBlank()) {
        return
    }
    Promise.resolve({
            prefix: undefined,
            feature: undefined,
            args: []
        })
        .then(request => parsePrefix(msg, request))
        .then(request => parseFeature(msg, request))
        .then(request => parseArguments(msg, request))
        .then(request => verifyBotPermissions(msg, request))
        .then(request => verifyUserPermissions(msg, request))
        .then(request => request.feature.handle(msg, ...request.args))
        .catch(handleError)
}