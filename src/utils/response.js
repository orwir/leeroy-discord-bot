import colors from '../internal/colors'

export const ERROR_NOT_COMMAND = "NOT_COMMAND"
export const ERROR_MISSING_PERMISSIONS = 'MISSING_PERMISSIONS'
export const IGNORED_ERRORS = [ERROR_NOT_COMMAND, ERROR_MISSING_PERMISSIONS]

export async function error({
    context,
    description,
    channel = null,
    text = '',
    title = null
} = {}) {
    return message({
        channel: channel || context.channel,
        text: text,
        title: title || context.t('global.error'),
        description: description,
        color: colors.highlightError
    })
}

export async function success({
    context,
    description,
    channel = null,
    text = '',
    title = null
} = {}) {
    return message({
        channel: channel || context.channel,
        text: text,
        title: title || context.t('global.success'),
        description: description,
        color: colors.highlightSuccess
    })
}

export async function message({
    channel,
    text = '',
    title = null,
    description = null,
    color = null,
    fields = null
} = {}) {
    return channel.send(text, {
        embed: {
            title: title,
            description: description,
            color: color,
            fields: fields
        }
    })
}

export async function log(context, error) {
    if (IGNORED_ERRORS.includes(error)) {
        return
    }
    console.error(error)
}