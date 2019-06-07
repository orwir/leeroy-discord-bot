const global = require('../../global')
const colors = global.colors

global.features.role = {

    name: 'role',

    group: global.groups.access,

    description: 'role.description',

    usage: 'role [@role] [description]',

    examples: 'role @game1 Gives access to game1 voice and text channels',

    arguments: 2,

    reaction: true,

    emojis: ['👌'],

    action: (msg, role, description) => {
        const t = global.obtainServerConfig(msg.guild.id).t

        if (!role) {
            global.man(msg, 'role')

        } else if (msg.guild.roles.get(role.slice(3, -1))) {
            msg.channel.send(description, {
                embed: {
                    color: colors.highlightDefault,
                    fields: [
                        {
                            name: t('global.tag'),
                            value: 'role',
                            inline: true
                        },
                        {
                            name: t('role.role'),
                            value: '' + role,
                            inline: true
                        },
                        {
                            name: t('role.howto'),
                            value: '👌',
                            inline: true
                        }
                    ]
                }
            })
            .then(result => { result.react('👌') })

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

    react: (msg, emoji, member, reacted) => {
        const snowflake = msg.embeds[0].fields[1].value
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