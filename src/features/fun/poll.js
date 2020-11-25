import colors from '../../internal/colors'
import groups from '../../internal/groups'
import P from '../../internal/permissions'
import { message } from '../../utils/response'
import { man } from '../settings/man'

export default {
    name: 'poll',
    group: groups.fun,
    description: 'poll.description',
    usage: 'poll [your message]',
    examples: 'poll.examples',
    arguments: 1,
    emojis: ['👍', '👎'],
    permissions: [P.MENTION_EVERYONE],

    execute: async (context, question) => {
        if (!question) {
            return man(context, 'poll')

        } else {
            return message({
                channel: context.channel,
                text: question,
                color: colors.highlightDefault,
                fields: [
                    {
                        name: 'feature',
                        value: 'poll',
                        inline: true
                    },
                    {
                        name: context.t('poll.reactions'),
                        value: context.t('poll.yesno'),
                        inline: true
                    }
                ]
            })
            .then(message => message.react('👍').then(() => message))
            .then(message => message.react('👎'))
        }
    },
}