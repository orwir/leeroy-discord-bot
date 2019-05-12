const common = require('../../common')

const save = require('../../misc/guild').save
const commands = common.commands
const guilds = common.guilds
const groups = common.groups
const colors = common.colors
const send = common.send
const man = common.man

commands.alias = {

    name: 'alias',

    group: groups.utility,

    description: 'alias.description',

    usage: 'alias [command] [alias]\nalias [command]',

    examples: 'alias prefix summon\nalias prefix',

    action: (msg, command, alias) => {
        const guild = guilds[msg.guild.id]
        const aliases = guild.aliases
        const t = guild.t
        const reserved = Object.keys(commands)
        reserved.push('help')

        // invalid command call
        if (!command || !commands[command]) {
            man(msg, 'alias')
            
        // shows list of aliases
        } else if (!alias) {
            send({
                channel: msg.channel,
                embed: {
                    title: t('alias.list', { command: command }),
                    description: Object.keys(aliases).filter(e => aliases[e] === command).join('\n'),
                    color: colors.highlightDefault
                }
            })

        } else if (reserved.includes(alias)) {
            send({
                channel: msg.channel,
                embed: {
                    title: t('alias.error'),
                    description: t('alias.word_is_reserved', {word: alias}),
                    color: colors.highlightError
                }
            })

        // add or remove alias
        } else {
            if (aliases[alias]) {
                delete aliases[alias]
            } else {
                aliases[alias] = commands[command].name
            }

            save(msg.guild.id)
            send({
                channel: msg.channel,
                embed: {
                    title: t(aliases[alias] ? 'alias.added_title' : 'alias.removed_title'),
                    description: t(aliases[alias] ? 'alias.added_description' : 'alias.removed_description', { alias: alias, command: command })
                }
            })
        }
    }

}