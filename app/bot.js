const Discord = require('discord.js')
const global = require('./global.js')

const Utility = require('./commands/utility.js')
const Fun = require('./commands/fun.js')
const Roles = require('./commands/roles.js')

const CMD_PREFIX = 'cmd'
const CMD_POLL = 'poll'
const CMD_WTF = 'wtf'
const EVT_MESSAGE = 'message'

const COMMANDS = global.COMMANDS
const CONFIG = global.CONFIG
const SINGLE_ARG_COMMANDS = [CMD_POLL]
const bot = new Discord.Client()

function configure_guild(guild) {
    if (CONFIG[guild.id] == null) {
        CONFIG[guild.id] = {
            PREFIX: CONFIG.PREFIX
        }
    }
}

bot.on(EVT_MESSAGE, msg => {
    configure_guild(msg.guild)

    var text = msg.content
    var prefix = CONFIG[msg.guild.id].PREFIX
    
    if (text.substring(0, prefix.length) == prefix) {
        var args = text.substring(prefix.length).split(' ')
        var cmd = args[0]
        
        if (SINGLE_ARG_COMMANDS.includes(cmd)) {
            var arg = text.substring(prefix.length + cmd.length)
            COMMANDS[CMD_PREFIX + cmd](msg, arg)
        } else {
            COMMANDS[CMD_PREFIX + cmd](msg, ...args.splice(1))
        }
    } else if (text == CONFIG.PREFIX + CMD_WTF) {
        COMMANDS.cmdwtf(msg)
    }
})

bot.login(CONFIG.AUTH_TOKEN)