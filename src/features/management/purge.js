import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import reference from '../../utils/reference.js'
import { error } from '../../utils/response.js'

const _limit = 90

export default {
    name: 'purge',
    group: groups.management,
    description: 'purge.description',
    usage: 'purge [<number>] [@<user>]?',
    examples: 'purge.examples',
    permissions: [P.MANAGE_MESSAGES],

    execute: async (context, last, userflake) => {
        const count = parseInt(last)
        if (!count || count > _limit) {
            return error({
                context: context,
                description: context.t('purge.limit_exceeded_or_not_number', { max: _limit }),
                command: 'purge',
                member: context.member
            })
        }
        const member = userflake ? await context.guild.members.fetch(reference(userflake)) : null

        return context.channel.messages
            .fetch({
                limit: _limit + 1,
                before: context.channel.lastMessageID
            })
            .then(messages => messages.array())
            .then(messages => messages
                .filter(m => !member || member.id === m.author.id)
                .slice(0, count)
            )
            .then(messages => Promise.all(messages.map(message => message.delete().catch(() => {}))))
    }
}