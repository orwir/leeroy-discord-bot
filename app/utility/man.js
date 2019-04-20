const global = require('../global.js')

global.commands.man = {

    title: 'man',

    group: global.groups.utility,

    description: 'Shows manual for commands (without arg shows full list)',

    usage: 'man [command]',

    examples: 'man man\nman prefix',

    action: (msg, command) => {
        let embed

        if (!command) {
            // shows full commands list
            embed = {
                title: 'Commands list',
                color: global.colors.highlightDefault,
                fields: []
            }
            let group = null
            Object.keys(global.commands)
                .map(e => global.commands[e])
                .sort((a, b) => { return a.group.order - b.group.order })
                .forEach(cmd => {
                    if (group !== cmd.group) {
                        group = cmd.group
                        embed.fields.push({
                            name: `${cmd.group.icon} ${cmd.group.title}`,
                            inline: true,
                            value: ''
                        })
                    }
                    let last = embed.fields[embed.fields.length - 1]
                    if (last.value.length > 0) {
                        last.value += ' '
                    }
                    last.value += cmd.title
                })

        } else if (global.commands[command] == null) {
            // command not found
            embed = {
                title: `${command} not found`,
                description: 'How dare you asking me about it?',
                color: global.colors.highlightError
            }

        } else {
            // shows manual for command
            let cmd = global.commands[command]
            embed = {
                title: cmd.title,
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
        
        msg.channel.send('', { embed: embed })
    }
    
}