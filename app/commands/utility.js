const shared = require('../shared.js')
const commands = shared.commands
const config = shared.config
const color_success = shared.color_success
const color_error = shared.color_error
const color_default = shared.color_default

commands.cmdman = (msg, name) => {
    var cmd = (name == null) ? commands.manman : commands['man' + name]
    if (cmd == null) {
        embed = {
            title: name,
            description: 'My apologies but command not found.',
            color: color_error
        }
    } else {
        man = cmd()
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

commands.manman = () => {
    return {
        title: 'man',
        description: 'Shows manual for commands',
        usage: 'man [command]',
        examples: 'man man\nman prefix'
    }
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
                }
            ]
        }
    })
}

commands.manwtf = () => {
    return {
        title: 'wtf',
        description: 'Shows information about bot',
        usage: 'wtf',
        examples: 'wtf'
    }
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

commands.manprefix = () => {
    return {
        title: 'prefix',
        description: 'Changes prefix to new value ("reset" restores default value)',
        usage: 'prefix [new value]',
        examples: 'prefix e!\nprefix reset'
    }
}