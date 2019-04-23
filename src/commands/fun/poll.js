const common = require('../../common')

const commands = common.commands
const groups = common.groups
const send = common.send

commands.poll = {

    name: 'poll',

    group: groups.fun,

    description: 'pollDescription',

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
            commands.man.action(msg, 'poll')
        }
    }

}