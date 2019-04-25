const common = require('../../common')

const commands = common.commands
const groups = common.groups
const guilds = common.guilds
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
        const developers = guilds[msg.guild.id].developers

        let embed
        // show list of developers
        if (!user) {
            embed = {
                title: t('lisfOfDevelopers'),
                description: developers.length > 0 ? developers.join('\n') : t('developersNotSet'),
                color: colors.highlightDefault
            }
        } else {
            let addded = false
            // remove developer from list
            if (developers.includes(user)) {
                developers.splice(developers.indexOf(user, 1))
            // add developer to list
            } else {
                developers.push(user)
                addded = true
            }

            embed = {
                title: addded ? t('developerAdded') : t('developerRemoved'),
                description: t(addded ? 'userWillReceiveDebugNotifications' : 'userWontReceiveDebugNotifications', { user: user }),
                color: colors.highlightSuccess
            }
        }
        send({
            channel: msg.channel,
            embed: embed
        })
    }

}