const common = require('../common')
const configure = require('../misc/guild').configure

const commands = common.commands
const guilds = common.guilds
const config = common.config
const colors = common.colors
const developers = common.developers
const send = common.send
const restricted = common.restricted

module.exports = async (msg) => {
    if (msg.author.bot || msg.content.isBlank()) {
        return
    }
    await configure(msg.guild)
    const guild = guilds[msg.guild.id]
    const t = guild.t
    let text = msg.content

    // verify prefix
    let prefix
    let onlyStable = false
    if (text.startsWith(guild.prefix)) {
        prefix = guild.prefix
    } else if (text.startsWith(config.prefix)) {
        prefix = config.prefix
        onlyStable = true
    }
    if (!prefix) {
        return
    }
    text = text.slice(prefix.length).trim()
    if (text.isBlank()) {
        return
    }
    
    // verify command
    let command
    let name = text.slice(0, (text.indexOf(' ') > 0) ? text.indexOf(' ') : text.length)
    text = text.slice(name.length + 1)
    command = commands[name]
    if (!command) {
        command = commands[guild.aliases[name]]
    }
    if (!command) {
        send({
            channel: msg.channel,
            embed: {
                title: t('commandNotFound', { name: name }),
                description: t('commandNotFoundDescription'),
                color: colors.highlightError
            }
        })
        return
    }
    if (restricted(guild, command, msg.channel, msg.guild.member(msg.author))) {
        // TODO: show message
        return
    }
    if (onlyStable && !command.stable) {
        return
    }
    if (command.dev && !config.dev) {
        return
    }

    // resolve arguments
    let args = []
    if (command.arguments) {
        for (i = 1; i <= command.arguments && text.length > 0; i++) {
            let arg
            if (i < command.arguments) {
                let index = text.indexOf(' ')
                arg = text.slice(0, index > 0 ? index : text.length)
                text = text.slice(arg.length + 1)
            } else {
                arg = text
            }
            args.push(arg)
        }
    } else {
        args = text.split(' ')
    }

    try {
        command.action(msg, ...args)
    } catch (error) {
        // TODO: log
        
        let message = config.dev ?
            t('internalErrorMessage', { author: msg.author, developers: developers ? developers.join('\n') : '' }) :
            null

        send({
            channel: msg.channel,
            text: message,
            embed: {
                title: t('internalError'),
                description: config.dev ? error.stack : t('internalErrorDescription'),
                color: colors.highlightError
            }
        })
    }

}