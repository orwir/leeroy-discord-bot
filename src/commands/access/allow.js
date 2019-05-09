const common = require('../../common')

const ALL = 'all'
const commands = common.commands
const groups = common.groups
const guilds = common.guilds
const colors = common.colors
const send = common.send
const man = common.man

commands.allow = {

    name: 'allow',

    group: groups.access,

    description: 'allow.description',

    usage: 'allow [command/alias/all] [channel/all] [group/user/all]',

    examples: 'allow man #general @moderators\nallow',

    action: (msg, command, channel, someone) => {
        const guild = guilds[msg.guild.id]
        const restrictions = guild.restrictions
        const t = guild.t
        let embed

        // show all restrictions
        if (!command) {
            embed = {
                title: t('allow.showAllTitle'),
                color: colors.highlightDefault
            }
            let cmds = Object.keys(restrictions)
            if (cmds.length > 0) {
                embed.fields = []
                cmds.forEach(cmd => {
                    embed.fields.push({
                        name: command,
                        value: commandRestrictionsToString(cmd, restrictions[cmd]),
                        inline: true
                    })
                })
            } else {
                embed.description = t('allow.noRestrictions')
            }

        // show restrictions for command
        } else if (!channel) {
            embed = {
                title: command,
                description: restrictions[command] ? commandRestrictionsToString(command, restrictions[command]) : t('allow.noRestrictions'),
                color: colors.highlightDefault
            }

        } else if (!someone) { // show man
            man(msg, 'allow')

        // add/remove restrictions
        } else {
            embed = updateRestrictions(guild, command, channel, someone)
        }
        if (embed) {
            send({
                channel: msg.channel,
                embed: embed
            })
        }
    },

    test: permitted

}

function commandRestrictionsToString(command, restriction) {
    return {
        name: command,
        value: Object.keys(restriction).forEach(channel => `#${channel}: ${restriction[channel].join(', ')}`),
        inline: true
    }
}

function permitted(guild, command, channel, author) {
    const NONE = 'none'
    const GRANTED = 'granted'
    const DENIED = 'denied'
    const OK = [NONE, GRANTED]

    function permission(command, channel, author) {
        // TODO: exlude admins
        // TODO: check by roles
        let allowed = guild.restrictions.path(`${command}.${channel}`)
        if (!allowed) {
            return NONE
        }
        return !allowed ? NONE : allowed.includes(author) ? GRANTED : DENIED
    }
    return OK.includes(permission(command, channel, author)) &&
        OK.includes(permission(command, ALL, author)) &&
        OK.includes(permission(ALL, channel, author)) &&
        OK.includes(permission(ALL, ALL, author))
}

function updateRestrictions(guild, command, channel, someone) {
    // allow all all all ---> Remove all restrictions
    // allow all all @someone ---> @someone able to use any command in any channel
    // allow all #channel all ---> In #channel anyone able to use anything
    // allow all #channel @someone ---> In #channel @someone able to use any command
    // allow command all all ---> Remove any restrictions for command for all channels
    // allow command all @someone ---> @someone able to use command in any channel
    // allow command #channel all ---> Remove restrictions for command in #channel
    // allow command #channel @someone ---> In #channel @someone able to use command

    let allowed = guild.restrictions.path(`${command}.${channel}`, [])
    if (!guild.restrictions[command]) {
        guild.restrictions[command] = {}
    }
    if (someone === ALL) {
        delete guild.restrictions[command][channel]
    } else {
        if (allowed.includes(someone)) {
            allowed.splice(allowed.indexOf(someone), 1)
        } else {
            allowed.push(someone)
        }
        if (allowed.length) {
            guild.restrictions[command][channel] = allowed
        } else {
            delete guild.restrictions[command][channel]
        }
    }
    // optimize restrictions
    for (let i of Object.keys(guild.restrictions)) {
        if (command === ALL || command === i) {
            for (let j of Object.keys(guild.restrictions[i])) {
                // remove user from other restrictions if he get more general
                if (command + channel !== i + j) {
                    if (channel === ALL || j === ALL || channel === j) {
                        if (someone === ALL) {
                            delete guild.restrictions[i][j]
                        } else {
                            let index = guild.restrictions[i][j].indexOf(someone)
                            if (index >= 0) {
                                guild.restrictions[i][j].splice(index, 1)
                            }
                            if (!guild.restrictions[i][j].length) {
                                delete guild.restrictions[i][j]
                            }
                        }
                    }
                }
            }
            // delete empty restrictions
            if (!Object.keys(guild.restrictions[i]).length) {
                delete guild.restrictions[i]
            }
        }
    }
    return embed = {
        title: guild.t('allow.changedTitle'),
        description: guild.t('allow.changedDescription'),
        color: colors.highlightSuccess
    }
}