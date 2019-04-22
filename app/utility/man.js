const global = require('../global.js')

global.commands.man = {

    name: 'man',

    group: global.groups.utility,

    description: 'Shows manual for commands (without arg shows full list)',

    usage: 'man [command]',

    examples: 'man man\nman prefix',

    action: (msg, command) => {
        let embed

        // shows full commands list
        if (!command) {
            embed = {
                title: 'Commands list',
                color: global.colors.highlightDefault,
                fields: []
            }
            let group = null
            Object.keys(global.commands)
                .map(e => global.commands[e])
                .sort((a, b) => a.group.order - b.group.order)
                .forEach(cmd => {
                    if (group !== cmd.group) {
                        group = cmd.group
                        embed.fields.push({
                            name: `${cmd.group.icon} ${cmd.group.name}`,
                            inline: true,
                            value: ''
                        })
                    }
                    let last = embed.fields[embed.fields.length - 1]
                    if (last.value.length > 0) {
                        last.value += ' '
                    }
                    last.value += cmd.name
                })

        // command not found
        } else if (!(global.commands[command] || global.config[msg.guild.id].aliases[command])) {
            embed = {
                title: `Command "${name}" not found!`,
                description: 'How dare you asking me about it?!',
                color: global.colors.highlightError
            }

        // shows user manual for command
        } else {
            let cmd = global.commands[command]
            if (!cmd) {
                cmd = global.config[msg.guild.id].aliases[command]
            }
            embed = {
                title: cmd.name,
                description: cmd.description,
                color: global.colors.highlightDefault,
                fields: [
                    {
                        name: 'Usage',
                        value: cmd.usage,
                        inline: true
                    },
                    {
                        name: 'Examples',
                        value: cmd.examples,
                        inline: true
                    }
                ]
            }
        }
        
        global.sendMessage({
            channel: msg.channel,
            embed: embed
        })
    }
    
}