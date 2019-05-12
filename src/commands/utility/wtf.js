const common = require('../../common')

const commands = common.commands
const groups = common.groups
const guilds = common.guilds
const colors = common.colors
const send = common.send

commands.wtf = {

    name: 'wtf',

    group: groups.utility,

    description: 'wtf.description',

    usage: 'wtf',

    examples: 'wtf',

    stable: true,

    action: (msg) => {
        const guild = guilds[msg.guild.id]
        const t = guild.t
        const name = msg.guild.name

        send({
            channel: msg.channel,
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
                        value: guild.prefix,
                        inline: true
                    },
                    {
                        name: t('wtf.language'),
                        value: guild.language,
                        inline: true
                    },
                    {
                        name: t('wtf.commands'),
                        value: commands.man.name
                    }
                ]
            }
        })
    }

}