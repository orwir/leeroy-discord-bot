import groups from '../../internal/groups'
import colors from '../../internal/colors'
import { Server, VERSION } from '../../internal/config'
import { REQUIRED as REQUIRED_PERMISSIONS } from '../../internal/permissions'

export default {
    name: 'help',
    group: groups.settings,
    description: 'help.description',
    usage: 'help',
    examples: 'help.examples',
    permissions: [],
    stable: true,

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
                    },
                    {
                        name: t('help.core_permissions'),
                        value: REQUIRED_PERMISSIONS.map(p => t(`permissions.${p.name}`)).join('\n')
                    }
                ]
            }
        })
    }
}