const global = require('../global.js')

global.commands.prefix = {

    title: 'prefix',

    group: global.groups.utility,

    description: 'Changes prefix to new value ("reset" restores default value)',

    usage: 'prefix [new value]',

    examples: 'prefix e!\nprefix reset',

    singleArgument: true,

    action: (msg, prefix) => {
        if (prefix) {
            global.config[msg.guild.id].prefix = (prefix === 'reset') ? global.config.prefix : prefix
            msg.channel.send('', {
                embed: {
                    title: 'Prefix successfully changed!',
                    description: `Summon me now by "${prefix}"`,
                    color: global.colors.highlightSuccess
                }
            })
        } else {
            global.commands.man.action(msg, global.commands.prefix.title)
        }
    }

}