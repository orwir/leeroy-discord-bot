const common = require('../../common')

const commands = common.commands
const groups = common.groups
const guilds = common.guilds
const send = common.send
const man = common.man

commands.allow = {

    title: 'allow',

    group: groups.access,

    description: 'allow.description',

    usage: 'allow [command/alias/all] [channel/all] [group/user/all]',

    examples: 'allow man #general @moderators\nallow',

    action: (msg, command, channel, someone) => {
        const restrictions = guilds[msg.guild.id].restrictions

        // show all restrictions
        if (!command) {

        // show restrictions for command
        } else if (!channel) {

        // show man
        } else if (!someone) {

        // add/remove restrictions
        } else {
            // allow all all all ---> Remove all restrictions
            if (command === 'all' && channel === 'all' && someone === 'all') {
                restrictions = {}

            // allow all all @someone ---> Only @someone able to use any command in any channel
            } else if (command === 'all' && channel === 'all') {
                if (!restrictions[command][channel]) {
                    restrictions[command][channel] = []
                }
                restrictions[command][channel].push(someone)

            // allow all #channel all ---> In #channel anyone able to use anything
            } else if (command === 'all' && someone === 'all') {
                
            }
        }
    },

    test: (guild, channel, author, command) => {
        const permissions = guild.permissions
        // allow command #channel @someone ---> In #channel only @someone able to use command
        // allow command #channel all      ---> Remove restrictions for command in #channel
        // allow command all all           ---> Remove any restrictions for command for all channels
        // allow command all @someone      ---> Only @someone able to use command in any channel
        // allow all #channel all          ---> In #channel anyone able to use anything
        // allow all #channel @someone     ---> In #channel only @someone able to use any command
        // allow all all @someone          ---> Only @someone able to use any command in any channel
        // allow all all all               ---> Remove all restrictions
        
        // #channel:@someone:e!command
    }

}