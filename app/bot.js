const Discord = require('discord.js')
const shared = require('./shared.js')

const Utility = require('./commands/utility.js')
const Fun = require('./commands/fun.js')
const Roles = require('./commands/roles.js')

const bot = new Discord.Client()
const commands = shared.commands
const config = shared.config
const one_arg_commands = ['poll']

function configure_guild(guild) {
    if (config[guild.id] == null) {
        config[guild.id] = {
            prefix: config.prefix
        }
    }
}

bot.on('message', msg => {
    configure_guild(msg.guild)

    var text = msg.content
    var prefix = config[msg.guild.id].prefix
    
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