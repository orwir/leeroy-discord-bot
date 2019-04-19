const Discord = require('discord.js')
const shared = require('./shared.js')

const Utility = require('./commands/utility.js')
const Fun = require('./commands/fun.js')
const Roles = require('./commands/roles.js')

const bot = new Discord.Client()
const commands = shared.commands
const config = shared.config
const one_arg_commands = ['poll']

bot.on('message', msg => {
    var guild_id = msg.guild.id
    var text = msg.content
    var prefix = (config[guild_id] != null) ? config[guild_id].prefix : config.prefix
    
    if (text.substring(0, prefix.length) == prefix) {
        var args = text.substring(prefix.length).split(' ')
        var cmd = args[0]
        args = args.splice(1)
        
        if (one_arg_commands.includes(cmd)) {
            var arg = text.substring(prefix.length + cmd.length)
            commands['cmd' + cmd](msg, arg)
        } else {
            commands['cmd' + cmd](msg, ...args)
        }
    }
})

bot.login(config.auth_token)