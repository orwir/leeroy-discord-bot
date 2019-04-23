const common = require('../../common')

const commands = common.commands
const groups = common.groups
const guilds = common.guilds
const colors = common.colors
const send = common.send

commands.wtf = {

    name: 'wtf',

    group: groups.utility,

    description: 'wtfDescription',

    usage: 'wtf',

    examples: 'wtf',

    stable: true,

    action: (msg) => {
        const t = guilds[msg.guild.id].t
        const prefix = guilds[msg.guild.id].prefix
        const name = msg.guild.name

        send({
            channel: msg.channel,
            embed: {
                title: t('wtfMessageTitle'),
                description: t('wtfMessageDescription'),
                color: colors.highlightDefault,
                fields: [
                    {
                        name: t('server'),
                        value: name
                    },
                    {
                        name: t('prefix'),
                        value: prefix
                    },
                    {
                        name: t('commandsOverview'),
                        value: commands.man.name
                    }
                ]
            }
        })
    }

}