const global = require('../global.js')

global.commands.man = {

    name: 'man',

    group: global.groups.utility,

    description: 'manDescription',

    usage: 'man [command]',

    examples: 'man man\nman prefix',

    action: (msg, command) => {
        const t = global.config[msg.guild.id].t
        let embed

        // shows full commands list
        if (!command) {
            embed = {
                title: t('commandsList'),
                color: global.colors.highlightDefault,
                fields: []
            }
            let group = null
            Object.keys(global.commands)
                .map(e => global.commands[e])
                .sort((a, b) => {
                   if (a.group.order == b.group.order) {
                        return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0
                   } else {
                       return a.group.order - b.group.order
                   }
                })
                .forEach(cmd => {
                    if (group !== cmd.group) {
                        group = cmd.group
                        embed.fields.push({
                            name: `${cmd.group.icon} ${t(cmd.group.name)}`,
                            inline: true,
                            value: ''
                        })
                    }
                    let last = embed.fields[embed.fields.length - 1]
                    if (last.value.length > 0) {
                        last.value += '\n'
                    }
                    last.value += cmd.name
                })

        // command not found
        } else if (!(global.commands[command] || global.config[msg.guild.id].aliases[command])) {
            embed = {
                title: t('commandNotFound'),
                description: t('commandNotFoundDescription'),
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
                description: t(cmd.description),
                color: global.colors.highlightDefault,
                fields: [
                    {
                        name: t('usage'),
                        value: cmd.usage,
                        inline: true
                    },
                    {
                        name: t('examples'),
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