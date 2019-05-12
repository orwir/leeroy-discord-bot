const common = require('../../common')

const save = require('../../misc/guild').save
const commands = common.commands
const groups = common.groups
const guilds = common.guilds
const colors = common.colors
const send = common.send

commands.developer = {

    name: 'developer',

    group: groups.utility,

    description: 'developer.description',

    usage: 'developer [user]',

    examples: 'developer @user#1234\developer',

    debug: true,

    action: (msg, user) => {
        const t = guilds[msg.guild.id].t
        const developers = guilds[msg.guild.id].developers

        let embed
        // show list of developers
        if (!user) {
            embed = {
                title: t('developer.list'),
                description: developers.length > 0 ? developers.join('\n') : t('developer.empty'),
                color: colors.highlightDefault
            }
        } else {
            let addded = false
            // remove
            if (developers.includes(user)) {
                developers.splice(developers.indexOf(user, 1))
            // add
            } else {
                developers.push(user)
                addded = true
            }

            save(msg.guild.id)
            embed = {
                title: addded ? t('developer.added') : t('developer.removed'),
                description: t(addded ? 'developer.developer_added' : 'developer.developer_removed', { user: user }),
                color: colors.highlightSuccess
            }
        }
        send({
            channel: msg.channel,
            embed: embed
        })
    },

}