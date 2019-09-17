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

export function path(object, path, def) {
    for (let segment of path.split('.')) {
        let index = -1
        if (segment.charAt(segment.length - 1) === ']') {
            index = parseInt(segment.charAt(segment.length - 2))
            segment = segment.slice(0, -3)
        }
        if (segment.charAt(0) === '{') {
            for (let variant of segment.slice(1, -1).split('|')) {
                if (object[variant]) {
                    object = object[variant]
                    break
                }
            }
        } else {
            object = object[segment]
        }
        if (index >= 0) {
            object = object[index]
        }
        if (!object) {
            break
        }
    }
    return object ? object : def
}