const global = require('../global.js')

global.commands.debug = {

    name: 'debug',

    group: global.groups.utility,

    description: 'Sets user to send debug messages',

    usage: 'debug [user]',

    examples: 'debug @user#1234\ndebug',

    dev: true,

    action: (msg, user) => {
        if (user) {
            global.developers.push(user)
            msg.channel.send('', {
                embed: {
                    title: 'New developer added!',
                    description: `${user} will receive error notifications.`,
                    color: global.colors.highlightSuccess
                }
            })
        } else {
            msg.channel.send('', {
                embed: {
                    title: 'List of developers:',
                    description: global.developers.length > 0 ? global.developers.join('\n') : 'Developers are not set.',
                    color: global.colors.highlightDefault
                }
            })
        }
    }

}