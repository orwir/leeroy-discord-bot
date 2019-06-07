const global = require('../../global')

global.features.poll = {

    name: 'poll',

    group: global.groups.fun,

    description: 'poll.description',

    usage: 'poll [question]',

    examples: 'poll Am I the best bot?',

    arguments: 1,

    reaction: true,

    emojis: ['👍', '👎'],

    action: (msg, question) => {
        if (question) {
            const t = global.obtainServerConfig(msg.guild.id).t

            msg.channel
                .send(`@here ${question}`, {
                    embed: {
                        color: global.colors.highlightDefault,
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
                .then(message => message.react('👍').then(() => message.react('👎')))
        } else {
            global.man(msg, 'poll')
        }
    },

    react: (msg, emoji, member, reacted) => {}

}