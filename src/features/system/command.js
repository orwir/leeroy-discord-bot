import channel from '../../internal/channel.js'
import { PREFIX, Server } from '../../internal/config.js'
import event from '../../internal/event.js'
import groups from '../../internal/groups.js'
import { verifyBotPermissions, verifyUserPermissions } from '../../internal/permissions.js'
import { register } from '../../internal/register.js'
import { error, ERROR_NOT_COMMAND, IGNORED_ERRORS, log, success } from '../../utils/response.js'
import features from '../index.js'

register('command', event.onMessage, { channel: channel.text })

const _separator = /\s+/

export default {
    name: 'command',
    group: groups.system,
    description: 'command.description',
    usage: '[<command>] [<arg>]*',
    examples: 'command.examples',
    permissions: [],
    unstoppable: true,

    execute: async (context) => success({
        context: context,
        description: context.t('command.response'),
        command: 'command',
        member: context.member
    }),

    [event.onMessage]: async (message) => {
        if (message.author.bot) return
        try {
            const request = {
                prefix: undefined,
                feature: undefined,
                args: []
            }
            await parsePrefix(message, request)
            await parseFeature(message, request)
            await parseArguments(message, request)
            showProgress(message, true)
            await verifyBotPermissions(message, request)
            await verifyUserPermissions(message, request)
            await execute(message, request)
            await clean(message)
        } catch (e) {
            log(message, e)
            if (!IGNORED_ERRORS.includes(e)) {
                await error({
                    context: message,
                    description: e,
                    command: message.content,
                    member: message.member
                }).catch(() => {})
            }
        } finally {
            showProgress(message, false)
        }
    }
}

async function parsePrefix(message, request) {
    const config = await Server.config(message.guild)
    if (message.content.startsWith(config.prefix)) {
        request.prefix = config.prefix
    } else if (message.content.startsWith(PREFIX)) {
        request.prefix = PREFIX
        request.onlyStable = true
    } else {
        throw ERROR_NOT_COMMAND
    }
}

async function parseFeature(message, request) {
    const raw = message.content
    const start = request.prefix.length
    let end = raw.slice(start).search(_separator)
    if (end == -1) {
        end = raw.length
    } else {
        end = start + end
    }
    if (start + end > 0) {
        const name = raw.slice(start, end)
        request.feature = features[name]
        if (request.feature && !(request.onlyStable && !request.feature.stable)) {
            return
        }
    }
    throw ERROR_NOT_COMMAND
}

async function parseArguments(message, request) {
    let rawargs = message.content.slice(`${request.prefix}${request.feature.name} `.length)
    if (!rawargs.trim()) {
        // do nothing
    } else if (!request.feature.arguments) {
        request.args.push(...rawargs.trim().split(_separator))
    } else {
        for (let i = 1; i <= request.feature.arguments && rawargs.length > 0; i++) {
            let arg
            if (i < request.feature.arguments) {
                let index = rawargs.search(_separator) || rawargs.length
                arg = rawargs.slice(0, index === -1 ? rawargs.length : index)
                rawargs = rawargs.slice(arg.length + 1).trimStart()
            } else {
                arg = rawargs
            }
            request.args.push(arg)
        }
    }
}

async function execute(message, request) {
    if (request.feature.execute) {
        return request.feature.execute(message, ...request.args)
    }
}

async function clean(message) {
    return message.delete().catch(error => log(message, error))
}

function showProgress(message, show) {
    if (show) {
        message.channel.startTyping()
    } else {
        message.channel.stopTyping(true)
    }
}
