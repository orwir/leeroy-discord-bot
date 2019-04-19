const Discord = require('discord.js')
const shared = require('./shared.js')
const basic = require('./utility/basic.js')

const bot = new Discord.Client()
const commands = shared.commands
const config = shared.config

bot.on('message', msg => {
    var guild = msg.guild.id
    var text = msg.content
    var prefix = (config[guild] != null) ? config[guild].prefix : config.prefix
    
    if (text.substring(0, prefix.length) == prefix) {
        var args = text.substring(prefix.length).split(' ')
        var cmd = args[0]
        args = args.splice(1)
        
        commands['cmd' + cmd](msg, ...args)
    }
})

bot.login(config.auth_token)