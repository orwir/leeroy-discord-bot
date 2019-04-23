const common = require('../../common')

const commands = common.commands
const groups = common.groups
const guilds = common.guilds
const developers = common.developers
const colors = common.colors
const send = common.send

commands.debug = {

    name: 'debug',

    group: groups.utility,

    description: 'debugDescription',

    usage: 'debug [user]',

    examples: 'debug @user#1234\ndebug',

    dev: true,

    action: (msg, user) => {
        const t = guilds[msg.guild.id].t

        if (user) {
            developers.push(user)
        }
        const description = user ?
            t('userWillReceiveErrorNotifications', { user: user }) :
            (developers.length > 0 ? developers.join('\n') : t('developersNotSet'))

        send({
            channel: msg.channel,
            embed: {
                title: user ? t('developerAdded') : t('lisfOfDevelopers'),
                description: description,
                color: user ? colors.highlightSuccess : colors.highlightDefault
            }
        })
    }

}