const common = require('../../common')
const colors = common.colors

common.features.role = {

    name: 'role',

    group: common.groups.access,

    description: 'role.description',

    usage: 'role [@role] [description]',

    examples: 'role @game1 Gives access to game1 voice and text channels',

    arguments: 2,

    action: (msg, role, description) => {
        const t = common.obtainServerConfig(msg.guild.id).t

        if (!role) {
            common.man(msg, 'role')

        } else if (msg.guild.roles.get(role.slice(3, -1))) {
            msg.channel.send(description, {
                embed: {
                    color: colors.highlightDefault,
                    fields: [
                        {
                            name: t('role.role'),
                            value: '' + role,
                            inline: true
                        },
                        {
                            name: t('role.howto'),
                            value: t('role.reaction'),
                            inline: true
                        }
                    ]
                }
            })
            .then(result => { result.react(t('role.reaction')) })

        } else {
            msg.channel.send('', {
                embed: {
                    title: t('role.not_found_title', {role: role }),
                    description: t('role.not_found_description'),
                    color: colors.highlightError
                }
            })
        }
    },

    update: (msg, author, emoji, reacted) => {
        const t = common.obtainServerConfig(msg.guild.id).t
        const snowflake = msg.embeds[0].fields[0].value

        const member = msg.guild.member(author)
        if (emoji !== t('role.reaction')) {
            if (reacted) {
                msg.reactions.get(emoji).remove(member)
            }
            return
        }
        const role = msg.guild.roles.get(snowflake.slice(3, -1))
        if (role && member) {
            if (reacted) {
                member.addRole(role)
            } else {
                member.removeRole(role)
            }
        }
    }

}