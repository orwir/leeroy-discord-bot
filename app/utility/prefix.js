const global = require('../global.js')

global.commands.prefix = {

    name: 'prefix',

    group: global.groups.utility,

    description: 'Changes prefix to new value ("reset" restores default value)',

    usage: 'prefix [new value]',

    examples: 'prefix e!\nprefix reset',

    arguments: 1,

    action: (msg, prefix) => {
        if (prefix) {
            global.config[msg.guild.id].prefix = (prefix === 'reset') ? global.config.prefix : prefix
            global.sendMessage({
                channel: msg.channel,
                embed: {
                    title: 'Prefix changed!',
                    description: `Summon me now by "${prefix}"`,
                    color: global.colors.highlightSuccess
                }
            })
        } else {
            global.commands.man.action(msg, global.commands.prefix.name)
        }
    }

}