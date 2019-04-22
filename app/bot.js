const discord = require('discord.js')
const global = require('./global.js')

require('./utility/index.js')
require('./fun/index.js')
require('./roles/index.js')

const singleArgumentCommands = Object.keys(global.commands)
    .filter(e => { return global.commands[e].singleArgument })

const staticPrefixCommands = Object.keys(global.commands)
    .filter(e => { return global.commands[e].staticPrefix })

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
    return staticPrefixCommands.filter(e => { return text.includes(e) }).length > 0
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
        let command = text.substring(0, (text.indexOf(' ') > 0) ? text.indexOf(' ') : text.length)
        
        if (!global.commands[command] && !guildConfig.aliases[command]) {
            msg.channel.send('', {
                embed: {
                    title: `${command} not found`,
                    description: 'How dare you asking me about it?',
                    color: global.colors.highlightError
                }
            })
        } else {
            text = text.substring(command.length + 1)
            if (!global.commands[command]) {
                command = guildConfig.aliases[command].name
            }
            // TODO: subject for refactoring
            if (singleArgumentCommands.includes(command)) {
                global.commands[command].action(msg, text)
            } else if (Object.keys(global.commands).includes(command)) {
                global.commands[command].action(msg, ...text.split(' '))
            }
        }
    }
})

bot.login(global.config.token)