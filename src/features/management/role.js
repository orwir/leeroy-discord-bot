import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import reference from '../../utils/reference.js'
import { error, success } from '../../utils/response.js'
import { verifyRolePosition } from '../../utils/role.js'
import { man } from '../settings/man.js'

export default {
    name: 'role',
    group: groups.management,
    description: 'role.description',
    usage: 'role [add/remove] [@role] [@user/voice]',
    examples: 'role.examples',
    arguments: 3,
    permissions: [P.MANAGE_ROLES],

    execute: async (context, action, roleflake, userflake) => {
        if (!(roleflake && userflake && ['add', 'remove'].includes(action))) {
            return man(context, 'role')
        }

        const role = await context.guild.roles.fetch(reference(roleflake))
        if (!role) {
            return error({
                context: context,
                description: context.t('role.role_not_found', { role: roleflake }),
                command: 'role',
                member: context.member
            })
        }
        if (!verifyRolePosition(context, context.member, role)) {
            return error({
                context: context,
                description: context.t('role.role_should_be_lower', { role: roleflake }),
                command: 'role',
                member: context.member
            })
        }

        const members = []
        if (userflake === 'voice') {
            if (!context.member.voice.channelID) {
                return error({
                    context: context,
                    description: context.t('role.you_are_not_in_voice_channel'),
                    command: 'role',
                    member: context.member
                })
            }
            members.push(...context.member.voice.channel.members.array())
        } else {
            const member = await context.guild.members.fetch(reference(userflake))
            if (!member) {
                return error({
                    context: context,
                    description: context.t('role.member_not_found', { member: userflake }),
                    command: 'role',
                    member: context.member
                })
            }
            members.push(member)
        }
        return Promise
            .all(members.map(member => member.roles[action](role)))
            .then(success({
                context: context,
                description: context.t('role.role_is_updated', {
                    role: roleflake,
                    action: context.t(`role.${action}`),
                    members: members.join('\n')
                }),
                command: 'role',
                member: context.member
            }))
    }
}