const discord = require('discord.js')
const bot = new discord.Client()
const config = require('../config.json')

bot.on('message', msg => {
    var guild = msg.guild
    var text = msg.content
    var prefix = (config[guild].prefix != null) ? config[guild].prefix : config.prefix
    
    if (text.substring(0, prefix.length) == prefix) {
        var args = text.substring(prefix.length).split(' ')
        var cmd = args[0]
        args = args.splice(1)

        commands[cmd](msg, ...args)
    }
})

bot.login(config.auth_token)