import '../../internal/extensions'
import groups from '../../internal/groups'
import colors from '../../internal/colors'
import man from '../settings/man'
import { Server } from '../../internal/config'

export default {
    name: 'role',
    group: groups.access,
    description: 'role.description',
    usage: 'role [@role] [description]',
    examples: 'role @somerole Gives access to some voice and text channels',
    arguments: 2,
    reaction: true,
    emojis: ['👌'],

    handle: async (msg, role, description) => {
        const t = await Server.language(msg.guild)

        if (!role) {
            man.handle(msg, 'role')

        } else if (msg.guild.roles.get(role.slice(3, -1))) {
            const embed = {
                embed: {
                    color: colors.highlightDefault,
                    fields: [
                        {
                            name: 'feature',
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
            }
            msg.channel
                .send(description, embed)
                .then(message => { message.react('👌') })

        } else {
            msg.channel.send('', {
                embed: {
                    title: t('global.error'),
                    description: t('role.role_not_found', { role: role }),
                    color: colors.highlightError
                }
            })
        }
    },

    react: async (msg, emoji, author, reacted) => {
       const snowflake = msg.embeds[0].fields[1].value
       const role = msg.guild.roles.get(snowflake.slice(3, -1))
       if (role && author) {
           if (reacted) {
               author.addRole(role)
           } else {
               author.removeRole(role)
           }
       }
    }
}