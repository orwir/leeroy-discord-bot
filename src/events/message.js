const common = require('../common')
const configure = require('../misc/guild').configure

const commands = common.commands
const guilds = common.guilds
const config = common.config
const colors = common.colors
const developers = common.developers
const send = common.send

module.exports = (msg) => {
    if (msg.author.bot || msg.content.isBlank()) {
        return
    }
    configure(msg.guild)
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
        command = guild.aliases[name]
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
    if (onlyStable && !command.stable) {
        return
    }
    if (command.dev && !config.dev) {
        return
    }

    // resolve arguments
    let args = []
    if (command.arguments) {
        for (i = 1; i <= command.arguments; i++) {
            let arg
            if (i < command.arguments) {
                arg = text.slice(0, text.indexOf(' '))
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
        // TODO: send to logs
        
        let message = config.dev ?
            guildConfig.t('internalErrorMessage', { author: msg.author, developers: developers.join('\n') }) :
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