const global = require('../global.js')

global.commands.alias = {

    name: 'alias',

    group: global.groups.utility,

    description: 'Add or remove alias for command. To see aliases for command type just command.',

    usage: 'alias [command] [alias]\nalias [command]',

    examples: 'alias prefix summon\nalias prefix',

    action: (msg, command, alias) => {
        // invalid command call
        if (!command || !global.commands[command]) {
            global.commands.man.action(msg, global.commands.alias.name)
            
        // shows list of aliases
        } else if (!alias) {
            let aliases = global.config[msg.guild.id].aliases
            global.sendMessage({
                channel: msg.channel,
                embed: {
                    title: `"${command}" aliases:`,
                    description: Object.keys(aliases).filter(e => aliases[e].name === command).join('\n'),
                    color: global.colors.highlightDefault
                }
            })

        // add or remove alias
        } else {
            if (aliases[alias]) {
                delete aliases[alias]
            } else {
                aliases[alias] = global.commands[command]
            }

            global.sendMessage({
                channel: msg.channel,
                embed: {
                    title: aliases[alias] ? 'Alias added!' : 'Alias removed!',
                    description: aliases[alias] ? `"${alias}" bound to "${command}"` : `"${alias}" unbound from "${command}"`
                }
            })
        }
    }

}