import channel from '../../internal/channel.js'
import event from '../../internal/event.js'
import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import { register } from '../../internal/register.js'
import { isAllowedEmoji } from '../../utils/emoji.js'
import reference from '../../utils/reference.js'
import { error, message } from '../../utils/response.js'
import { canSetRole } from '../../utils/role.js'
import { resolve } from '../index.js'
import { man } from '../settings/man.js'

register('likerole', event.onReaction, { channel: channel.text })

export default {
    name: 'likerole',
    group: groups.management,
    description: 'likerole.description',
    usage: 'likerole [@<role>] [<description>]',
    examples: 'likerole.examples',
    arguments: 2,
    emojis: ['👌'],
    permissions: [P.MANAGE_ROLES],

    execute: async (context, snowflake, description) => {
        if (!reference(snowflake)) return man(context, 'likerole')
        
        const role = await context.guild.roles.fetch(reference(snowflake))
        if (!role) {
            return error({
                context: context,
                description: context.t('role.role_not_found', { role: snowflake }),
                command: 'likerole',
                member: context.member
            })
        }
        if (!canSetRole(context, role)) {
            return error({
                context: context,
                description: context.t('role.role_should_be_lower', { role: snowflake }),
                command: 'likerole',
                member: context.member
            })
        }
        return message({
            channel: context.channel,
            text: description,
            command: 'likerole',
            member: context.member,
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

    [event.onReaction]: async (reaction, user, reacted) => {
        const feature = resolve(reaction.message)
        if (!feature || feature.name !== 'likerole') return
        if (!isAllowedEmoji(feature, reaction.message, reaction.emoji)) {
            return
        }
        const snowflake = reaction.message.embeds[0].fields[1].value
        const guild = reaction.message.guild
        const role = await guild.roles.fetch(reference(snowflake))
        const member = await guild.members.fetch(user)
        if (role && member) {
            await member.roles[reacted ? 'add' : 'remove'](role)
        }
    }
}