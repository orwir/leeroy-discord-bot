const global = require('../global.js')

global.commands.debug = {

    name: 'debug',

    group: global.groups.utility,

    description: 'debugDescription',

    usage: 'debug [user]',

    examples: 'debug @user#1234\ndebug',

    dev: true,

    action: (msg, user) => {
        if (user) {
            global.developers.push(user)
        }
        const t = global.config[msg.guild.id].t
        let description = user ?
            t('userWillReceiveErrorNotifications', { user: user }) :
            (global.developers.length > 0 ? global.developers.join('\n') : t('developersNotSet'))

        global.sendMessage({
            channel: msg.channel,
            embed: {
                title: user ? t('developerAdded') : t('lisfOfDevelopers'),
                description: description,
                color: user ? global.colors.highlightSuccess : global.colors.highlightDefault
            }
        })
    }

}