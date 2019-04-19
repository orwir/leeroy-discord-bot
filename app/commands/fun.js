const shared = require('../shared.js')
const commands = shared.commands

commands.cmdpoll = (msg, question) => {
    msg.channel.send('@here' + question).then(shard => {
        shard.react('👍')
        shard.react('👎')
    })
}

commands.manpoll = () => {
    return {
        title: 'poll',
        description: 'Creates "yes/no" poll with positive 👍 and negative 👎 reactions.',
        usage: 'poll [question]',
        examples: 'poll Am I the best bot?'
    }
}