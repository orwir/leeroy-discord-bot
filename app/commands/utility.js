const global = require('../global.js')

const COMMANDS = global.COMMANDS
const CONFIG = global.CONFIG
const COLORS = global.COLORS
const GROUP_NAME = 'utility'
const GROUP_ICON = ':gear:'
const MAN_PREFIX = 'man'

COMMANDS.cmdman = (msg, name) => {
    var man = COMMANDS[MAN_PREFIX + name]
    if (name == null) {
        var mans = Object.keys(COMMANDS)
            .filter(e => { return e.startsWith(MAN_PREFIX) })
            .sort((a, b) => {
                var ag = COMMANDS[a].group_name
                var bg = COMMANDS[b].group_name
                return ag > bg ? 1 : ((bg > ag ? -1 : 0))
            })
        embed = {
            title: 'Commands overview',
            color: COLORS.MSG_DEFAULT,
            fields: []
        }
        var group = null
        mans.forEach(m => {
            var current = COMMANDS[m]
            if (group != current.group_name) {
                group = current.group_name
                embed.fields.push({
                    name: current.group_icon + current.group_name,
                    inline: true,
                    value: ''
                })
            }
            var last = embed.fields[embed.fields.length - 1]
            if (last.value.length > 0) {
                last.value += ' '
            }
            last.value += current.title
        })
    } else if (man == null) {
        embed = {
            title: name,
            description: 'My apologies but command not found.',
            color: COLORS.MSG_ERROR
        }
    } else {
        embed = {
            title: man.title,
            description: man.description,
            color: COLORS.MSG_DEFAULT,
            fields: [
                {
                    name: 'Usage',
                    value: man.usage,
                    inline: true
                },
                {
                    name: 'Examples',
                    value: man.examples,
                    inline: true
                }
            ]
        }
    }
    msg.channel.send('', { embed: embed })
}

COMMANDS.manman = {
    group_name: GROUP_NAME,
    group_icon: GROUP_ICON,
    title: 'man',
    description: 'Shows manual for commands',
    usage: 'man [command]',
    examples: 'man man\nman prefix'
}

COMMANDS.cmdwtf = (msg) => {
    const guild = msg.guild

    msg.channel.send('', {
        embed: {
            title: 'Greetings mortals!',
            description: `I'm The Executor and I'm here to rule!`,
            color: COLORS.MSG_DEFAULT,
            fields: [
                {
                    name: 'Server',
                    value: guild.name
                },
                {
                    name: 'Prefix',
                    value: CONFIG[guild.id].PREFIX
                },
                {
                    name: 'Commands overview',
                    value: 'man'
                }
            ]
        }
    })
}

COMMANDS.manwtf = {
    group_name: GROUP_NAME,
    group_icon: GROUP_ICON,
    title: 'wtf',
    description: 'Shows information about bot',
    usage: 'wtf',
    examples: 'wtf'
}

COMMANDS.cmdprefix = (msg, prefix) => {
    if (prefix != null) {
        if (prefix == 'reset') {
            prefix = CONFIG.PREFIX
        }
        CONFIG[msg.guild.id].PREFIX = prefix
        msg.channel.send('', {
            embed: {
                title: 'Prefix successfully changed!',
                description: `Summon me now by "${prefix}"`,
                color: COLORS.MSG_SUCCESS
            }
        })
    } else {
        COMMANDS.cmdman(msg, 'prefix')
    }
}

COMMANDS.manprefix = {
    group_name: GROUP_NAME,
    group_icon: GROUP_ICON,
    title: 'prefix',
    description: 'Changes prefix to new value ("reset" restores default value)',
    usage: 'prefix [new value]',
    examples: 'prefix e!\nprefix reset'
}