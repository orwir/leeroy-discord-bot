const common = require('../../common')
const colors = common.colors

common.features.prefix = {

    name: 'prefix',

    group: common.groups.utility,

    description: 'prefix.description',

    usage: 'prefix [new value]',

    examples: 'prefix e!\nprefix reset',

    arguments: 1,

    action: (msg, prefix) => {
        if (prefix) {
            const config = common.obtainServerConfig(msg.guild.id)
            const t = config.t

            config.prefix = (prefix === 'reset') ? common.config.prefix : prefix
            common.saveServerConfig(msg.guild.id)
            msg.channel.send('', {
                embed: {
                    title: t('prefix.changed_title'),
                    description: t('prefix.changed_description', { prefix: config.prefix }),
                    color: colors.highlightSuccess
                }
            })
        } else {
            common.man(msg, 'prefix')
        }
    }

}