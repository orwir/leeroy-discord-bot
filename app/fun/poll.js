const global = require('../global.js')

global.commands.poll = {

    name: 'poll',

    group: global.groups.fun,

    description: 'Creates "yes/no" poll with positive (👍) and negative (👎) reactions.',

    usage: 'poll [question]',

    examples: 'poll Am I the best bot?',

    arguments: 1,

    action: (msg, question) => {
        if (question) {
            global.sendMessage({
                    channel: msg.channel,
                    text: `@here ${question}`
                })
                .then(result => {
                    result.react('👍')
                    result.react('👎')
                })
        } else {
            global.commands.man.action(msg, global.commands.poll.name)
        }
    }

}