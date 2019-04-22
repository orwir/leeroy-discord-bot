const discord = require('discord.js')
const global = require('./global.js')

require('./utility/index.js')
require('./fun/index.js')
require('./access/index.js')

const staticPrefixCommands = Object.keys(global.commands)
    .filter(e => global.commands[e].staticPrefix)

const bot = new discord.Client()

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

function isStaticPrefixCommand(text) {
    return staticPrefixCommands.filter(e => text.includes(e)).length > 0
}

bot.on(global.events.message, msg => {
    configureGuild(msg.guild)

    let guildConfig = global.config[msg.guild.id]
    let text = msg.content
    let prefix = guildConfig.prefix

    if (text.startsWith(global.config.prefix) && isStaticPrefixCommand(text)) {
        prefix = global.config.prefix
    } else if (!text.startsWith(prefix)) {
        text = null
    }
    
    if (text) {
        text = text.substring(prefix.length)
        let name = text.substring(0, (text.indexOf(' ') > 0) ? text.indexOf(' ') : text.length)
        
        if (!global.commands[name] && !guildConfig.aliases[name]) {
            msg.channel.send('', {
                embed: {
                    title: `${name} not found`,
                    description: 'How dare you asking me about it?',
                    color: global.colors.highlightError
                }
            })
        } else {
            text = text.substring(name.length + 1)
            if (!global.commands[name]) {
                name = guildConfig.aliases[name].name
            }
            let command = global.commands[name]
            let args = []
            if (command.arguments) {
                for (i = 1; i <= command.arguments; i++) {
                    let arg
                    if (i < command.arguments) {
                        arg = text.substring(0, text.indexOf(' '))
                        text = text.substring(arg.length + 1)
                    } else {
                        arg = text
                    }
                    args.push(arg)
                }
            } else {
                args = text.split(' ')
            }
            command.action(msg, ...args)
        }
    }
})

bot.login(global.config.token)