const global = require('../../global')
const colors = global.colors

global.features.alias = {

    name: 'alias',

    group: global.groups.utility,

    description: 'alias.description',

    usage: 'alias [command] [alias]\nalias [command]',

    examples: 'alias prefix summon\nalias prefix',

    action: (msg, command, alias) => {
        const config = global.obtainServerConfig(msg.guild.id)
        const aliases = config.aliases
        const t = config.t

        // invalid command call
        if (!command || !global.features[command]) {
            global.man(msg, 'alias')
            
        // shows list of aliases
        } else if (!alias) {
            msg.channel.send('', {
                embed: {
                    title: t('alias.list', { command: command }),
                    description: Object.keys(aliases).filter(e => aliases[e] === command).join('\n'),
                    color: colors.highlightDefault
                }
            })

        } else if (reserved().includes(alias)) {
            msg.channel.send('', {
                embed: {
                    title: t('alias.error'),
                    description: t('alias.word_is_reserved', { word: alias }),
                    color: colors.highlightError
                }
            })

        // add or remove alias
        } else {
            if (aliases[alias]) {
                delete aliases[alias]
            } else {
                aliases[alias] = global.features[command].name
            }

            global.saveServerConfig(msg.guild.id)
            msg.channel.send('', {
                embed: {
                    title: t(aliases[alias] ? 'alias.added_title' : 'alias.removed_title'),
                    description: t(aliases[alias] ? 'alias.added_description' : 'alias.removed_description', { alias: alias, command: command })
                }
            })
        }
    },

    reserved: reserved

}

function reserved() {
    const reserved = Object.keys(global.features)
    reserved.push('help')
    return reserved
}