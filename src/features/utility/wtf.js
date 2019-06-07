const global = require('../../global')
const colors = global.colors

global.features.wtf = {

    name: 'wtf',

    group: global.groups.utility,

    description: 'wtf.description',

    usage: 'wtf',

    examples: 'wtf',

    stable: true,

    action: (msg) => {
        const config = global.obtainServerConfig(msg.guild.id)
        const t = config.t

        msg.channel.send('', {
            embed: {
                title: t('wtf.message_title'),
                description: t('wtf.message_description'),
                color: colors.highlightDefault,
                fields: [
                    {
                        name: t('wtf.version'),
                        value: global.config.vesrion
                    },
                    {
                        name: t('wtf.commands'),
                        value: global.features.man.name
                    },
                    {
                        name: t('wtf.language'),
                        value: config.language
                    },
                    {
                        name: t('wtf.prefix'),
                        value: config.prefix
                    }
                ]
            }
        })
    }

}