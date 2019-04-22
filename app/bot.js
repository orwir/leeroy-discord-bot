const discord = require('discord.js')
const global = require('./global.js')

require('./utility/index.js')
require('./fun/index.js')
require('./access/index.js')

const bot = new discord.Client()

bot.on(global.events.message, msg => {
    if (msg.author.bot || msg.content.isBlank()) {
        return
    }

    configureGuild(msg.guild)
    let guildConfig = global.config[msg.guild.id]
    let text = msg.content

    // verify prefix
    let prefix
    let onlyStable = false
    if (text.startsWith(guildConfig.prefix)) {
        prefix = guildConfig.prefix
    } else if (text.startsWith(global.config.prefix)) {
        prefix = global.config.prefix
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
    command = global.commands[name]
    if (!command) {
        command = guildConfig.aliases[name]
    }
    if (!command) {
        global.sendMessage({
            channel: msg.channel,
            embed: {
                title: `Command "${name}" not found!`,
                description: 'How dare you asking me about it?!',
                color: global.colors.highlightError
            }
        })
        return
    }
    if (onlyStable && !command.stable) {
        return
    }
    if (command.dev && !global.config.dev) {
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

    // invoke command
    try {
        command.action(msg, ...args)
    } catch (error) {
        global.sendMessage({
            channel: msg.channel,
            text: global.config.dev ? `@${msg.author.tag} is trying to kill me! Help me please ${global.developers.join(', ')}` : null,
            embed: {
                title: `Internal error!`,
                description: global.config.dev ? error.stack : 'Are you trying to destabilize me?',
                color: global.colors.highlightError
            }
        })
    }
})

function configureGuild(guild) {
    if (!global.config[guild.id]) {
        global.config[guild.id] = {
            prefix: global.config.prefix,
            aliases: {
                help: global.commands.wtf
            }
        }
    }
}

bot.login(global.config.token)