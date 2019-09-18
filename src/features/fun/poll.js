import groups from '../../internal/groups'
import colors from '../../internal/colors'
import P from '../../internal/permissions'
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
            const embed = {
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
            }

            return context.channel
                .send(question, { embed: embed })
                .then(message => message.react('👍').then(() => message))
                .then(message => message.react('👎'))
        }
    },

    react: async (msg, emoji, author, reacted) => {}
}