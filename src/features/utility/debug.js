const groups = require('../../internal/groups')
const colors = require('../../internal/colors')
const server = require('./server')
const language = require('./language')

global.features.debug = {
    name: 'debug',
    group: groups.utility,
    description: 'debug.description',
    usage: 'debug [1/0]',
    examples: 'debug 1\ndebug',

    action: async (msg, debug) => {
        const settings = await server.obtain(msg.guild)
        const t = await language.obtain(settings.language)

        debug = parseInt(debug)
        if (debug === 1 || debug === 0) {
            settings.debug = debug
            server.save(msg.guild.id)
        }

        msg.channel.send('', {
            embed: {
                title: t('debug.status'),
                description: t(settings.debug ? 'debug.enabled' : 'debug.disabled'),
                color: colors.highlightSuccess
            }
        })
    },

    log: async (msg, error) => {
        const settings = await server.obtain(msg.guild)
        const t = await language.obtain(settings.language)
        const developers = settings.developers && settings.developers.length ? settings.developers.join('\n') : ''
        // TODO: log

        msg.channel.send(
            settings.debug ? t('debug.call_developers', { author: msg.author, developers: developers }) : '',
            {
                embed: {
                    title: t('debug.internal_error'),
                    description: config.debug ? error.stack : t('debug.internal_error_placeholder'),
                    color: colors.highlightError
                }
            }
        )
    }
}