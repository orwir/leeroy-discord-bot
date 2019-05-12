const common = require('../common')

const configure = require('../misc/guild').configure
const commands = common.commands
const guilds = common.guilds
const config = common.config
const colors = common.colors
const send = common.send
const restricted = common.restricted
const log = common.log

module.exports = async (msg) => {
    if (msg.author.bot || msg.content.isBlank()) {
        return
    }
    await configure(msg.guild)
    const guild = guilds[msg.guild.id]
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
                title: guild.t('global.command_not_found_title', { name: name }),
                description: guild.t('global.command_not_found_description'),
                color: colors.highlightError
            }
        })
        return
    }
    if (restricted(guild, command, msg.channel, msg.guild.member(msg.author))) {
        return
    }
    if (onlyStable && !command.stable) {
        return
    }
    if (command.debug && !guild.debug) {
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
        log(msg, error)
    }

}