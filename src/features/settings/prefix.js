import groups from '../../internal/groups'
import man from './man'
import { Server } from '../../internal/config'
import colors from '../../internal/colors'
import P from '../../internal/permissions'

const MAX_LENGTH = 5

export default {
    name: 'prefix',
    group: groups.settings,
    description: 'prefix.description',
    usage: 'prefix [new prefix]',
    examples: 'prefix.examples',
    arguments: 1,
    permissions: [P.ADMINISTRATOR],

    handle: async (msg, prefix) => {
        if (!prefix) {
            return man.handle(msg, 'prefix')

        } else if (prefix.length > MAX_LENGTH) {
            const t = await Server.language(msg.guild)
            return msg.channel.send('', {
                embed: {
                    title: t('global.error'),
                    description: t('prefix.max_length_exceeded', { length: MAX_LENGTH }),
                    color: colors.highlightError
                }
            })

        } else {
            const config = await Server.config(msg.guild)
            const t = await Server.language(msg.guild)

            config.prefix = prefix
            await Server.save(msg.guild)

            return msg.channel.send('', {
                embed: {
                    title: t('global.success'),
                    description: t('prefix.new_prefix', { prefix: prefix }),
                    color: colors.highlightSuccess
                }
            })
        }
    }
}