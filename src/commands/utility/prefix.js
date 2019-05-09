const common = require('../../common')

const save = require('../../misc/guild').save
const commands = common.commands
const groups = common.groups
const config = common.config
const guilds = common.guilds
const colors = common.colors
const send = common.send
const man = common.man

commands.prefix = {

    name: 'prefix',

    group: groups.utility,

    description: 'prefix.description',

    usage: 'prefix [new value]',

    examples: 'prefix e!\nprefix reset',

    arguments: 1,

    action: (msg, prefix) => {
        if (prefix) {
            const guild = guilds[msg.guild.id]
            const t = guild.t

            guild.prefix = (prefix === 'reset') ? config.prefix : prefix
            save(msg.guild.id)
            send({
                channel: msg.channel,
                embed: {
                    title: t('prefix.changedTitle'),
                    description: t('prefix.changedDescription', { prefix: prefix }),
                    color: colors.highlightSuccess
                }
            })
        } else {
            man(msg, 'prefix')
        }
    }

}