const groups = require('../../internal/groups')
const colors = require('../../internal/colors')
const server = require('./server')
const language = require('./language')
const man = require('./man').action
const features = require('../../features')

module.exports = {
    name: 'alias',
    group: groups.utility,
    description: 'alias.description',
    usage: 'alias [command] [alias]\nalias [command]',
    examples: 'alias prefix summon\nalias prefix',

    action: async (msg, command, alias) => {
        const settings = await server.obtain(msg.guild)
        const t = await language.obtain(settings.language)
        const featuresList = features.get()
        const aliases = settings.aliases

        // invalid command call
        if (!command || !featuresList[command]) {
            man(msg, 'alias')
            
        // shows list of aliases
        } else if (!alias) {
            msg.channel.send('', {
                embed: {
                    title: t('alias.list', { command: command }),
                    description: Object.keys(aliases).filter(e => aliases[e] === command).join('\n'),
                    color: colors.highlightDefault
                }
            })

        } else if (reserved(alias)) {
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
                aliases[alias] = featuresList[command].name
            }

            server.save(msg.guild.id)
            msg.channel.send('', {
                embed: {
                    title: t(aliases[alias] ? 'alias.added_title' : 'alias.removed_title'),
                    description: t(aliases[alias] ? 'alias.added_description' : 'alias.removed_description', { alias: alias, command: command })
                }
            })
        }
    }

}

function reserved(word) {
    const reserved = features.get()
    reserved.push('help')
    return reserved.includes(word)
}