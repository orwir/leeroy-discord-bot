const global = require('../global.js')

global.commands.wtf = {

    name: 'wtf',

    group: global.groups.utility,

    description: 'wtfDescription',

    usage: 'wtf',

    examples: 'wtf',

    stable: true,

    action: (msg) => {
        const guild = msg.guild
        const t = global.config[guild.id].t

        global.sendMessage({
            channel: msg.channel,
            embed: {
                title: t('wtfMessageTitle'),
                description: t('wtfMessageDescription'),
                color: global.colors.highlightDefault,
                fields: [
                    {
                        name: t('server'),
                        value: guild.name
                    },
                    {
                        name: t('prefix'),
                        value: global.config[guild.id].prefix
                    },
                    {
                        name: t('commandsOverview'),
                        value: global.commands.man.name
                    }
                ]
            }
        })
    }

}