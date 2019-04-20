const global = require('../global.js')

const COMMANDS = global.COMMANDS
const GROUP_NAME = 'fun'
const GROUP_ICON = ':smile:'

COMMANDS.cmdpoll = (msg, question) => {
    if (question != null) {
        msg.channel.send('@here ' + question).then(shard => {
            shard.react('👍')
            shard.react('👎')
        })
    } else {
        COMMANDS.cmdman(msg, 'poll')
    }
}

COMMANDS.manpoll = {
    group_name: GROUP_NAME,
    group_icon: GROUP_ICON,
    title: 'poll',
    description: 'Creates "yes/no" poll with positive 👍 and negative 👎 reactions.',
    usage: 'poll [question]',
    examples: 'poll Am I the best bot?'
}