const global = require('../global.js')

global.commands.poll = {

    name: 'poll',

    group: global.groups.fun,

    description: 'Creates "yes/no" poll with positive 👍 and negative 👎 reactions.',

    usage: 'poll [question]',

    examples: 'poll Am I the best bot?',

    singleArgument: true,

    action: (msg, question) => {
        if (question) {
            msg.channel.send(`@here ${question}`).then(shard => {
                shard.react('👍')
                shard.react('👎')
            })
        } else {
            global.commands.man.action(msg, global.commands.poll.title)
        }
    }

}