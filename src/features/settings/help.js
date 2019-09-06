import groups from '../../internal/groups'
import colors from '../../internal/colors'
import { Server, VERSION } from '../../internal/config'

export default {
    name: 'help',
    group: groups.settings,
    description: 'help.description',
    usage: 'help',
    examples: 'help',
    permissions: [],

    handle: async (msg) => {
        const config = await Server.config(msg.guild)
        const t = await Server.language(msg.guild)

        return await msg.channel.send('', {
            embed: {
                color: colors.highlightDefault,
                fields: [
                    {
                        name: t('help.version'),
                        value: VERSION
                    },
                    {
                        name: t('help.commands_list'),
                        value: 'man'
                    },
                    {
                        name: t('help.language'),
                        value: config.language
                    },
                    {
                        name: t('help.prefix'),
                        value: config.prefix
                    }
                ]
            }
        })
    }
}