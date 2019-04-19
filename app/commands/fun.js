const shared = require('../shared.js')
const commands = shared.commands

commands.cmdpoll = (msg, question) => {
    msg.channel.send('@here' + question).then(shard => {
        shard.react('👍')
        shard.react('👎')
    })
}