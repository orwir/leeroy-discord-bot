import groups from '../../internal/groups'
import P from '../../internal/permissions'
import reference from '../../utils/reference'
import { error, success } from '../../utils/response'
import { verifyRolePosition } from '../../utils/role'
import { man } from '../settings/man'

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

        const role = context.guild.roles.get(reference(roleflake))
        if (!role) {
            return error({
                context: context,
                description: context.t('role.role_not_found', { role: roleflake })
            })
        }
        if (!(await verifyRolePosition(context, context.member, role))) {
            return error({
                context: context,
                description: context.t('role.role_should_be_lower', { role: roleflake })
            })
        }

        const members = []
        if (userflake === 'voice') {
            if (!context.member.voiceChannelID) {
                return error({
                    context: context,
                    description: context.t('role.you_are_not_in_voice_channel')
                })
            }
            members.push(...context.member.voiceChannel.members.array())
        } else {
            const member = context.guild.members.get(reference(userflake))
            if (!member) {
                return error({
                    context: context,
                    description: context.t('role.member_not_found', { member: userflake })
                })
            }
            members.push(member)
        }
        return Promise
            .all(members.map(m => m.roles[action](role)))
            .then(success({
                context: context,
                description: context.t('role.role_is_updated', {
                    role: roleflake,
                    action: context.t(`role.${action}`),
                    members: members.join('\n')
                })
            }))
    }
}