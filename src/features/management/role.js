import groups from '../../internal/groups'
import colors from '../../internal/colors'
import P from '../../internal/permissions'
import reference from '../../utils/reference'
import { man } from '../settings/man'
import { verifyRolePosition } from '../../utils/role'
import { error, success } from '../../utils/response'

export default {
    name: 'role',
    group: groups.management,
    description: 'role.description',
    usage: 'role [add/remove] [@role] [@user/voice]',
    examples: 'role.examples',
    arguments: 3,
    emojis: ['👌'],
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

        if (!verifyRolePosition(context, role)) {
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
            .all(members.map(m => m[action === 'add' ? 'addRole' : 'removeRole'](role)))
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