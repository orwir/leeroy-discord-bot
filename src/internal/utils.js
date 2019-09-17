import colors from './colors'

export const ERROR_NOT_COMMAND = "NOT_COMMAND"
export const ERROR_MISSING_PERMISSIONS = 'MISSING_PERMISSIONS'
export const IGNORED_ERRORS = [ERROR_NOT_COMMAND, ERROR_MISSING_PERMISSIONS]

export async function error({
    context,
    channel = null,
    text = '',
    title = null,
    description
} = {}) {
    return (channel || context.channel)
        .send(text, {
            embed: {
                title: title || args.context.t('global.error'),
                description: description,
                color: colors.highlightError
            }
        })
}

export async function log(context, error) {
    if (IGNORED_ERRORS.includes(error)) {
        return
    }
    console.log(error)
}