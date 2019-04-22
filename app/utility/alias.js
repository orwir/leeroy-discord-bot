const global = require('../global.js')

global.commands.alias = {

    name: 'alias',

    group: global.groups.utility,

    description: 'Add or remove alias for command. To see aliases for command type just command.',

    usage: 'alias [command] [alias]\nalias [command]',

    examples: 'alias prefix summon\nalias prefix',

    action: (msg, command, alias, remove) => {
        if (!command || !global.commands[command]) {
            global.commands.man.action(msg, global.commands.alias.name)
            
        } else if (!alias) {
            // shows list of aliases
            let aliases = global.config[msg.guild.id].aliases
            let known = Object.keys(aliases)
                .filter(e => { return aliases[e].name === command })
                .reduce((accumulator, name) => {
                    if (accumulator) {
                        accumulator += '\n'
                    }
                    return accumulator += name
                }, '')
            msg.channel.send('', {
                embed: {
                    title: `Aliases for "${command}"`,
                    description: known,
                    color: global.colors.highlightDefault
                }
            })

        } else {
            // add or remove alias
            let title
            let description
            let aliases = global.config[msg.guild.id].aliases
            if (aliases[alias]) {
                delete aliases[alias]
                title = 'Alias successfully removed!'
                description = `Alias ${alias} is unbound from "${command}"`
            } else {
                aliases[alias] = global.commands[command]
                title = 'Alias successfully added!'
                description = `Alias "${alias}" is bound to "${command}"`

            }
            msg.channel.send('', {
                embed: {
                    title: title,
                    description: description,
                    color: global.colors.highlightSuccess
                }
            })
        }
    }

}