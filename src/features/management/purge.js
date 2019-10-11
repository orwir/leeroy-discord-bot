import groups from '../../internal/groups'
import P from '../../internal/permissions'
import reference from '../../utils/reference'
import { error } from '../../utils/response'

const LIMIT = 90

export default {
    name: 'purge',
    group: groups.management,
    description: 'purge.description',
    usage: 'purge [last] [@user]?',
    examples: 'purge.examples',
    permissions: [P.MANAGE_MESSAGES],

    execute: async (context, last, userflake) => {
        const count = parseInt(last)
        if (!count || count > LIMIT) {
            return error({
                context: context,
                description: context.t('purge.limit_exceeded_or_not_number', { max: LIMIT })
            })
        }
        const member = context.guild.members.get(reference(userflake))

        return context.channel
            .fetchMessages({
                limit: LIMIT + 1,
                before: context.channel.lastMessageID
            })
            .then(messages => messages.array())
            .then(messages => messages
                .filter(m => !member || member.id === m.author.id)
                .slice(0, count)
            )
            .then(messages => Promise.all(messages.map(m => m.delete().catch({}))))
    }
}