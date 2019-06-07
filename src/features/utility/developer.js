const global = require('../../global')
const colors = global.colors

global.features.developer = {

    name: 'developer',

    group: global.groups.utility,

    description: 'developer.description',

    usage: 'developer [user]',

    examples: 'developer @user#1234\developer',

    debug: true,

    action: (msg, user) => {
        const config = global.obtainServerConfig(msg.guild.id)
        const developers =config.developers
        const t = config.t

        let embed
        // show list of developers
        if (!user) {
            embed = {
                title: t('developer.list'),
                description: developers.length > 0 ? developers.join('\n') : t('developer.empty'),
                color: colors.highlightDefault
            }
        } else {
            let added = false
            // remove
            if (developers.includes(user)) {
                developers.splice(developers.indexOf(user, 1))
            // add
            } else {
                developers.push(user)
                added = true
            }

            global.saveServerConfig(msg.guild.id)
            embed = {
                title: added ? t('developer.added') : t('developer.removed'),
                description: t(added ? 'developer.developer_added' : 'developer.developer_removed', { user: user }),
                color: colors.highlightSuccess
            }
        }
        msg.channel.send('', { embed: embed })
    }

}