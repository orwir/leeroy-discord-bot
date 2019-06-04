const common = require('../../common')

common.features.poll = {

    name: 'poll',

    group: common.groups.fun,

    description: 'poll.description',

    usage: 'poll [question]',

    examples: 'poll Am I the best bot?',

    arguments: 1,

    action: (msg, question) => {
        if (question) {
            msg.channel
                .send(`@here ${question}`)
                .then(message => message.react('👍').then(() => message.react('👎')))
        } else {
            common.man(msg, 'poll')
        }
    }

}