import groups from '../../internal/groups'
import colors from '../../internal/colors'
import P from '../../internal/permissions'
import { man } from '../settings/man'
import { error } from '../../internal/utils'

export default {
    name: 'role',
    group: groups.access,
    description: 'role.description',
    usage: 'role [@role] [description]',
    examples: 'role.examples',
    arguments: 2,
    emojis: ['👌'],
    permissions: [P.MANAGE_ROLES],

    execute: async (context, snowflake, description) => {
        const role = context.guild.roles.get(snowflake.slice(3, -1))

        if (!snowflake) {
            return man(context, 'role')

        } else if (!role) {
            return error({
                context: context,
                description: context.t('role.role_not_found', { role: snowflake })
            })

        } else if (!hasHigherRole(context.member, role)) {
            return error({
                context: context,
                description: context.t('role.role_is_higher_or_equals_than_member')
            })
        
        } else if (!hasHigherRole(context.guild.member(context.client.user), role)) {
            return error({
                context: context,
                description: context.t('role.role_is_higher_or_equals_than_bot')
            })

        } else {
            return createRoleMessage(context, snowflake, description)
        }
    },

    react: async (context, emoji, author, reacted) => {
       const snowflake = context.embeds[0].fields[1].value
       const role = context.guild.roles.get(snowflake.slice(3, -1))
       if (role && author) {
           if (reacted) {
               return author.addRole(role)
           } else {
               return author.removeRole(role)
           }
       }
    }
}

async function createRoleMessage(context, snowflake, description) {
    return context.channel
        .send(description, {
            embed: {
                color: colors.highlightDefault,
                fields: [
                    {
                        name: 'feature',
                        value: 'role',
                        inline: true
                    },
                    {
                        name: context.t('role.role'),
                        value: '' + snowflake,
                        inline: true
                    },
                    {
                        name: context.t('role.howto'),
                        value: '👌',
                        inline: true
                    }
                ]
            }
        })
        .then(message => message.react('👌'))
}

function hasHigherRole(member, expected) {
    return member.roles
        .find(role => role.comparePositionTo(expected) > 0)
}