const colors = require('../../internal/colors')
const groups = require('../../internal/groups')
const config = require('../../internal/config')
const server = require('./server')
const language = require('./language')
const man = require('./man')

module.exports = {
    name: 'prefix',
    group: groups.utility,
    description: 'prefix.description',
    usage: 'prefix [new value]',
    examples: 'prefix e!\nprefix reset',
    arguments: 1,

    action: async (msg, prefix) => {
        if (prefix) {
            const settings = await server.obtain(msg.guild)
            const t = await language.obtain(settings.language)

            settings.prefix = (prefix === 'reset') ? config.prefix : prefix
            server.save(msg.guild.id)
            msg.channel.send('', {
                embed: {
                    title: t('prefix.changed_title'),
                    description: t('prefix.changed_description', { prefix: settings.prefix }),
                    color: colors.highlightSuccess
                }
            })
        } else {
            man.action(msg, 'prefix')
        }
    }

}