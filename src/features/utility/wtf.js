require('../../internal/extensions')
const groups = require('../../internal/groups')
const colors = require('../../internal/colors')
const config = require('../../internal/config')
const server = require('./server')
const language = require('./language')
const man = require('./man')

module.exports = {
    name: 'wtf',
    group: groups.utility,
    description: 'wtf.description',
    usage: 'wtf',
    examples: 'wtf',
    stable: true,

    action: async (msg) => {
        const settings = await server.obtain(msg.guild)
        const t = await language.obtain(settings.language)

        msg.channel.send('', {
            embed: {
                title: t('wtf.message_title'),
                description: t('wtf.message_description'),
                color: colors.highlightDefault,
                fields: [
                    {
                        name: t('wtf.version'),
                        value: config.vesrion
                    },
                    {
                        name: t('wtf.commands'),
                        value: man.name
                    },
                    {
                        name: t('wtf.language'),
                        value: settings.language
                    },
                    {
                        name: t('wtf.prefix'),
                        value: settings.prefix
                    }
                ]
            }
        })
    }

}