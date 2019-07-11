const groups = require('../../internal/groups')
const colors = require('../../internal/colors')
const server = require('./server')
const language = require('./language')

module.exports = {
    name: 'developer',
    group: groups.utility,
    description: 'developer.description',
    usage: 'developer [user]',
    examples: 'developer @user#1234\developer',
    debug: true,

    action: async (msg, user) => {
        const settings = await server.obtain(msg.guild)
        const t = await language.obtain(settings.language)
        const developers = settings.developers

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

            server.save(msg.guild.id)
            embed = {
                title: added ? t('developer.added') : t('developer.removed'),
                description: t(added ? 'developer.developer_added' : 'developer.developer_removed', { user: user }),
                color: colors.highlightSuccess
            }
        }
        msg.channel.send('', { embed: embed })
    }

}