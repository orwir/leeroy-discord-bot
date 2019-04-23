const discord = require('discord.js')
const global = require('./global.js')

require('./utility/index.js')
require('./fun/index.js')
require('./access/index.js')

global.i18n.init({

    lng: 'en',

    fallbackLng: 'en',

    preload: true,

    resources: {
        en: {
            translation: require('../res/locales/en.json')
        },
        ru: {
            translation: require('../res/locales/ru.json')
        }
    }
})

const bot = new discord.Client()

bot.on(global.events.message, msg => {
    if (msg.author.bot || msg.content.isBlank()) {
        return
    }

    configureGuild(msg.guild)
    const guildConfig = global.config[msg.guild.id]
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
                title: guildConfig.t('commandNotFound', { name: name }),
                description: guildConfig.t('commandNotFoundDescription'),
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

    try {
        command.action(msg, ...args)
    } catch (error) {
        let developers = global.developers.length > 0 ? global.developers.join('\n') : t('developersNotFound')
        let message = global.config.dev ?
            guildConfig.t('internalErrorMessage', { author: msg.author, developers: developers }) :
            null

        global.sendMessage({
            channel: msg.channel,
            text: message,
            embed: {
                title: guildConfig.t('internalError'),
                description: global.config.dev ? error.stack : guildConfig.t('internalErrorDescription'),
                color: global.colors.highlightError
            }
        })
    }
})

function configureGuild(guild) {
    if (!global.config[guild.id]) {
        global.config[guild.id] = {

            t: global.i18n.getFixedT('en'),

            prefix: global.config.prefix,

            aliases: {
                help: global.commands.wtf
            }

        }
    }
}

bot.login(global.config.token)