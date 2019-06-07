const global = require('../../global')
const colors = global.colors

global.features.debug = {

    name: 'debug',

    group: global.groups.utility,

    description: 'debug.description',

    usage: 'debug [1/0]',

    examples: 'debug 1\ndebug',

    action: (msg, debug) => {
        const config = global.obtainServerConfig(msg.guild.id)
        const t = config.t

        debug = parseInt(debug)
        if (debug === 1 || debug === 0) {
            config.debug = debug
            global.saveServerConfig(msg.guild.id)
        }

        msg.channel.send('', {
            embed: {
                title: t('debug.status'),
                description: t(config.debug ? 'debug.enabled' : 'debug.disabled'),
                color: colors.highlightSuccess
            }
        })
    },

    log: (msg, error) => {
        const config = global.obtainServerConfig(msg.guild.id)
        const t = config.t
        const developers = config.developers && config.developers.length ? config.developers.join('\n') : ''
        // TODO: log

        msg.channel.send(
            config.debug ? t('debug.call_developers', { author: msg.author, developers: developers }) : '',
            { embed: {
                title: t('debug.internal_error'),
                description: config.debug ? error.stack : t('debug.internal_error_placeholder'),
                color: colors.highlightError
            }
        })
    }

}