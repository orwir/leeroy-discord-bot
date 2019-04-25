const common = require('../../common')

const commands = common.commands
const groups = common.groups
const send = common.send
const man = common.man

commands.poll = {

    name: 'poll',

    group: groups.fun,

    description: 'poll.description',

    usage: 'poll [question]',

    examples: 'poll Am I the best bot?',

    arguments: 1,

    action: (msg, question) => {
        if (question) {
            send({
                    channel: msg.channel,
                    text: `@here ${question}`
                })
                .then(result => {
                    result.react('👍')
                    result.react('👎')
                })
        } else {
            man(msg, 'poll')
        }
    }

}