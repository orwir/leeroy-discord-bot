const global = require('../global.js')

global.commands.prefix = {

    name: 'prefix',

    group: global.groups.utility,

    description: 'prefixDescription',

    usage: 'prefix [new value]',

    examples: 'prefix e!\nprefix reset',

    arguments: 1,

    action: (msg, prefix) => {
        if (prefix) {
            const guildConfig = global.config[msg.guild.id]

            guildConfig.prefix = (prefix === 'reset') ? global.config.prefix : prefix
            global.sendMessage({
                channel: msg.channel,
                embed: {
                    title: guildConfig.t('prefixChanged'),
                    description: guildConfig.t('prefixChangedDescription', { prefix: prefix }),
                    color: global.colors.highlightSuccess
                }
            })
        } else {
            global.commands.man.action(msg, global.commands.prefix.name)
        }
    }

}