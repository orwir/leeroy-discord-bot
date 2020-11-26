import { PREFIX, Server } from '../../internal/config'
import groups from '../../internal/groups'
import P from '../../internal/permissions'
import { error, success } from '../../utils/response'
import { man } from './man'

const _maxLength = 5

export default {
    name: 'prefix',
    group: groups.settings,
    description: 'prefix.description',
    usage: 'prefix [new prefix]',
    examples: 'prefix.examples',
    arguments: 1,
    permissions: [P.ADMINISTRATOR],

    execute: async (context, prefix) => {
        if (!prefix) {
            return man(context, 'prefix')
        } else if (prefix.length > _maxLength) {
            return error({
                context: context,
                description: context.t('prefix._maxLength_exceeded', { length: _maxLength })
            })
        } else {
            const config = await Server.config(context)
            config.prefix = prefix === 'reset' ? PREFIX : prefix
            await Server.save(context, config)

            return success({
                context: context,
                description: context.t('prefix.new_prefix', { prefix: config.prefix })
            })
        }
    }
}
