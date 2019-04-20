const shared = require('../shared.js')
const commands = shared.commands
const group = ':smile:fun'

commands.cmdpoll = (msg, question) => {
    msg.channel.send('@here' + question).then(shard => {
        shard.react('👍')
        shard.react('👎')
    })
}

commands.manpoll = {
    group: group,
    title: 'poll',
    description: 'Creates "yes/no" poll with positive 👍 and negative 👎 reactions.',
    usage: 'poll [question]',
    examples: 'poll Am I the best bot?'
}