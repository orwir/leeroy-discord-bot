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
        }
        let description = user ?
            `${user} will receive error notifications.` :
            (global.developers.length > 0 ? global.developers.join('\n') : 'Developers are not set.')

        global.sendMessage({
            channel: msg.channel,
            embed: {
                title: user ? 'Developer added!' : 'List of developers:',
                description: description,
                color: user ? global.colors.highlightSuccess : global.colors.highlightDefault
            }
        })
    }

}