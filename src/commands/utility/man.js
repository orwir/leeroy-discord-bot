const common = require('../../common')

const commands = common.commands
const groups = common.groups
const guilds = common.guilds
const colors = common.colors
const send = common.send

commands.man = {

    name: 'man',

    group: groups.utility,

    description: 'man.description',

    usage: 'man [command]',

    examples: 'man man\nman prefix',

    arguments: 1,

    action: (msg, name) => {
        const guild = guilds[msg.guild.id]
        let embed

        // shows full commands list
        if (!name) {
            embed = {
                title: guild.t('man.list'),
                color: colors.highlightDefault,
                fields: []
            }
            let group = null
            Object.keys(commands)
                .map(e => commands[e])
                .filter(e => !e.debug || guild.debug)
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
                            name: `${cmd.group.icon} ${guild.t(cmd.group.name)}`,
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
        } else if (!(commands[name] || guild.aliases[name])) {
            embed = {
                title: guild.t('global.command_not_found_title'),
                description: guild.t('global.command_not_found_description'),
                color: colors.highlightError
            }

        // shows user manual for command
        } else {
            let command = commands[name]
            if (!command) {
                command = commands[guild.aliases[name]]
            }
            embed = {
                title: command.name,
                description: guild.t(command.description),
                color: colors.highlightDefault,
                fields: [
                    {
                        name: guild.t('man.usage'),
                        value: command.usage,
                        inline: true
                    },
                    {
                        name: guild.t('man.examples'),
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