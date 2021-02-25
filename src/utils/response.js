import colors from '../internal/colors.js'

export const ERROR_NOT_COMMAND = 'NOT_COMMAND'
export const ERROR_MISSING_PERMISSIONS = 'MISSING_PERMISSIONS'
export const IGNORED_ERRORS = [ERROR_NOT_COMMAND, ERROR_MISSING_PERMISSIONS]

export async function error({
    context,
    description,
    channel = null,
    text = '',
    title = null,
    command = null,
    member = null,
} = {}) {
    return message({
        channel: channel || context.channel,
        text: text,
        title: title || context.t('global.error'),
        description: description,
        color: colors.highlightError,
        command: command,
        member: member
    })
}

export async function success({
    context,
    description,
    channel = null,
    text = '',
    title = null,
    command = null,
    member = null,
} = {}) {
    return message({
        channel: channel || context.channel,
        text: text,
        title: title || context.t('global.success'),
        description: description,
        color: colors.highlightSuccess,
        command: command,
        member: member
    })
}

export async function message({
    channel,
    text = '',
    title = null,
    description = null,
    color = colors.highlightDefault,
    fields = null,
    command = null,
    member = null,
    footer = null,
} = {}) {
    return channel.send(text, {
        embed: {
            author: !command ? null : { name: `• ${command} •` },
            title: title,
            description: description,
            color: color,
            fields: fields,
            footer: footer,
        }
    })
}

export async function log(context, error) {
    if (IGNORED_ERRORS.includes(error)) {
        return
    }
    console.error(error)
}
