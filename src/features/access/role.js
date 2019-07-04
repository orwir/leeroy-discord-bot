const colors = require('../../internal/colors')
const groups = require('../../internal/groups')
const server = require('../utility/server')
const language = requre('../utility/language')
const man = require('../utility/man')

module.exports = {
    name: 'role',
    group: groups.access,
    description: 'role.description',
    usage: 'role [@role] [description]',
    examples: 'role @game1 Gives access to game1 voice and text channels',
    arguments: 2,
    reaction: true,
    emojis: ['👌'],

    action: async (msg, role, description) => {
        const settings = await server.obtain(msg.guild)
        const t = language.get(settings.language)

        if (!role) {
            man.action(msg, 'role')

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

    onReaction: (msg, emoji, member, reacted) => {
        const roleSnowflake = msg.embeds[0].fields[1].value
        const role = msg.guild.roles.get(roleSnowflake.slice(3, -1))
        if (role && member) {
            if (reacted) {
                member.addRole(role)
            } else {
                member.removeRole(role)
            }
        }
    }

}