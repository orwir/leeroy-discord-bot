const common = require('../../common')
const colors = common.colors

common.features.wtf = {

    name: 'wtf',

    group: common.groups.utility,

    description: 'wtf.description',

    usage: 'wtf',

    examples: 'wtf',

    stable: true,

    action: (msg) => {
        const config = common.obtainServerConfig(msg.guild.id)
        const t = config.t
        const name = msg.guild.name

        msg.channel.send('', {
            embed: {
                title: t('wtf.message_title'),
                description: t('wtf.message_description'),
                color: colors.highlightDefault,
                fields: [
                    {
                        name: t('wtf.server'),
                        value: name
                    },
                    {
                        name: t('wtf.prefix'),
                        value: config.prefix,
                        inline: true
                    },
                    {
                        name: t('wtf.language'),
                        value: config.language,
                        inline: true
                    },
                    {
                        name: t('wtf.commands'),
                        value: common.features.man.name
                    }
                ]
            }
        })
    }

}