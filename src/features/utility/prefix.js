const global = require('../../global')
const colors = global.colors

global.features.prefix = {

    name: 'prefix',

    group: global.groups.utility,

    description: 'prefix.description',

    usage: 'prefix [new value]',

    examples: 'prefix e!\nprefix reset',

    arguments: 1,

    action: (msg, prefix) => {
        if (prefix) {
            const config = global.obtainServerConfig(msg.guild.id)
            const t = config.t

            config.prefix = (prefix === 'reset') ? global.config.prefix : prefix
            global.saveServerConfig(msg.guild.id)
            msg.channel.send('', {
                embed: {
                    title: t('prefix.changed_title'),
                    description: t('prefix.changed_description', { prefix: config.prefix }),
                    color: colors.highlightSuccess
                }
            })
        } else {
            global.man(msg, 'prefix')
        }
    }

}