const shared = require('../shared.js')
const commands = shared.commands
const config = shared.config
const color_success = shared.color_success
const color_error = shared.color_error
const color_default = shared.color_default
const group = ':gear:utility'

commands.cmdman = (msg, name) => {
    var man = commands['man' + name]
    if (name == null) {
        var mans = Object.keys(commands)
            .filter(e => { return e.startsWith('man') })
            .sort((a, b) => {
                var ag = commands[a].group.substring(commands[a].group.lastIndexOf(':'))
                var bg = commands[b].group.substring(commands[b].group.lastIndexOf(':'))
                return ag > bg ? 1 : ((bg > ag ? -1 : 0))
            })
        embed = {
            title: 'Commands overview',
            color: color_default,
            fields: []
        }
        var group = null
        mans.forEach(m => {
            var current = commands[m]
            if (group != current.group) {
                group = current.group
                embed.fields.push({
                    name: group,
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
            color: color_error
        }
    } else {
        embed = {
            title: man.title,
            description: man.description,
            color: color_default,
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

commands.manman = {
    group: group,
    title: 'man',
    description: 'Shows manual for commands',
    usage: 'man [command]',
    examples: 'man man\nman prefix'
}

commands.cmdwtf = (msg) => {
    const guild = msg.guild

    msg.channel.send('', {
        embed: {
            title: 'Greetings mortals!',
            description: `I'm The Executor and I'm here to rule!`,
            color: color_default,
            fields: [
                {
                    name: 'Server',
                    value: guild.name
                },
                {
                    name: 'Prefix',
                    value: config[guild.id].prefix
                },
                {
                    name: 'Commands overview',
                    value: 'man'
                }
            ]
        }
    })
}

commands.manwtf = {
    group: group,
    title: 'wtf',
    description: 'Shows information about bot',
    usage: 'wtf',
    examples: 'wtf'
}

commands.cmdprefix = (msg, prefix) => {
    if (prefix != null) {
        config[msg.guild.id].prefix = prefix
        msg.channel.send('', {
            embed: {
                title: 'Prefix successfully changed!',
                description: `Summon me now by "${prefix}"`,
                color: color_success
            }
        })
    } else {
        commands.cmdman(msg, 'prefix')
    }
}

commands.manprefix = {
    group: group,
    title: 'prefix',
    description: 'Changes prefix to new value ("reset" restores default value)',
    usage: 'prefix [new value]',
    examples: 'prefix e!\nprefix reset'
}