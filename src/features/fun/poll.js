const common = require('../../common')

common.features.poll = {

    name: 'poll',

    group: common.groups.fun,

    description: 'poll.description',

    usage: 'poll [question]',

    examples: 'poll Am I the best bot?',

    arguments: 1,

    reaction: true,

    emojis: ['👍', '👎'],

    action: (msg, question) => {
        if (question) {
            const t = common.obtainServerConfig(msg.guild.id).t

            msg.channel
                .send(`@here ${question}`, {
                    embed: {
                        color: common.colors.highlightDefault,
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
            common.man(msg, 'poll')
        }
    },

    react: (msg, emoji, member, reacted) => {}

}