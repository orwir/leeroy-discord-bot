const common = require('../../common')

const commands = common.commands
const groups = common.groups
const guilds = common.guilds
const colors = common.colors
const send = common.send

commands.man = {

    name: 'man',

    group: groups.utility,

    description: 'manDescription',

    usage: 'man [command]',

    examples: 'man man\nman prefix',

    arguments: 1,

    action: (msg, name) => {
        const t = guilds[msg.guild.id].t
        const aliases = guilds[msg.guild.id].aliases
        let embed

        // shows full commands list
        if (!name) {
            embed = {
                title: t('commandsList'),
                color: colors.highlightDefault,
                fields: []
            }
            let group = null
            Object.keys(commands)
                .map(e => commands[e])
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
        } else if (!(commands[name] || aliases[name])) {
            embed = {
                title: t('commandNotFound'),
                description: t('commandNotFoundDescription'),
                color: colors.highlightError
            }

        // shows user manual for command
        } else {
            let command = commands[name]
            if (!command) {
                command = aliases[name]
            }
            embed = {
                title: command.name,
                description: t(command.description),
                color: colors.highlightDefault,
                fields: [
                    {
                        name: t('usage'),
                        value: command.usage,
                        inline: true
                    },
                    {
                        name: t('examples'),
                        value: command.examples,
                        inline: true
                    }
                ]
            }
        }
        
        send({
            channel: msg.channel,
            embed: embed
        })
    }
    
}