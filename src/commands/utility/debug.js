const common = require('../../common')

const save = require('../../misc/guild').save
const commands = common.commands
const groups = common.groups
const guilds = common.guilds
const colors = common.colors
const send = common.send

commands.debug = {

    name: 'debug',

    group: groups.utility,

    description: 'debug.description',

    usage: 'debug [1/0]',

    examples: 'debug 1\ndebug',

    action: (msg, debug) => {
        const guild = guilds[msg.guild.id]

        debug = parseInt(debug)
        if (debug === 1 || debug === 0) {
            guild.debug = debug
            save(msg.guild.id)
        }

        send({
            channel: msg.channel,
            embed: {
                title: guild.t('debug.status'),
                description: guild.t(guild.debug ? 'debug.enabled' : 'debug.disabled'),
                color: colors.highlightSuccess
            }
        })
    },

    log: (msg, error) => {
        const guild = guilds[msg.guild.id]
        const developers = guild.developers && guild.developers.length ? guild.developers.join('\n') : ''
        // TODO: log

        send({
            channel: msg.channel,
            text: guild.debug ? guild.t('debug.call_developers', { author: msg.author, developers: developers }) : '',
            embed: {
                title: guild.t('debug.internal_error'),
                description: guild.debug ? error.stack : guild.t('debug.internal_error_placeholder'),
                color: colors.highlightError
            }
        })
    }

}