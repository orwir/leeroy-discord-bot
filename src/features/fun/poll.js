const groups = require('../../internal/groups')
const colors = require('../../internal/colors')
const server = require('../utility/server')
const language = require('../utility/language')
const man = require('../utility/man').action

module.exports = {
    name: 'poll',
    group: groups.fun,
    description: 'poll.description',
    usage: 'poll [question]',
    examples: 'poll Am I the best bot?',
    arguments: 1,
    reaction: true,
    emojis: ['👍', '👎'],

    action: async (msg, question) => {
        if (question) {
            const settings = await server.obtain(msg.guild)
            const t = await language.obtain(settings.language)

            msg.channel.send(`@here ${question}`, {
                    embed: {
                        color: colors.highlightDefault,
                        fields: [
                            {
                                name: t('global.tag'),
                                value: 'poll',
                                inline: true
                            },
                            {
                                name: t('poll.reactions'),
                                value: t('poll.yesno'),
                                inline: true
                            }
                        ]
                    }
                })
                .then(message => message.react('👍').then(() => message))
                .then(message => message.react('👎'))
        } else {
            man(msg, 'poll')
        }
    }
}