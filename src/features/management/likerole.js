import groups from '../../internal/groups'
import colors from '../../internal/colors'
import P from '../../internal/permissions'
import { man } from '../settings/man'
import { error, message } from '../../utils/response'
import { verifyRolePosition } from '../../utils/role'
import reference from '../../utils/reference'

export default {
    name: 'likerole',
    group: groups.management,
    description: 'likerole.description',
    usage: 'likerole [@role] [description]',
    examples: 'likerole.examples',
    arguments: 2,
    emojis: ['👌'],
    permissions: [P.MANAGE_ROLES],

    execute: async (context, snowflake, description) => {
        if (!snowflake) {
            return man(context, 'likerole')
        }
        const role = context.guild.roles.get(reference(snowflake))
        
        if (!role) {
            return error({
                context: context,
                description: context.t('likerole.role_not_found', { role: snowflake })
            })
        }

        if (!verifyRolePosition(context, role)) {
            return error({
                context: context,
                description: context.t('likerole.role_should_be_lower', { role: snowflake })
            })
        }

        return message({
            channel: context.channel,
            text: description,
            color: colors.highlightDefault,
            fields: [
                {
                    name: 'feature',
                    value: 'likerole',
                    inline: true
                },
                {
                    name: context.t('likerole.role'),
                    value: '' + snowflake,
                    inline: true
                },
                {
                    name: context.t('likerole.howto'),
                    value: '👌',
                    inline: true
                }
            ]
        })
        .then(message => message.react('👌'))
    },

    react: async (context, emoji, author, reacted) => {
       const snowflake = context.embeds[0].fields[1].value
       const role = context.guild.roles.get(reference(snowflake))
       if (role && author) {
           return author[reacted ? 'addRole' : 'removeRole'](role)
       }
    }
}