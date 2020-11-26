import { PREFIX } from '../../internal/config.js'
import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import storage from '../../internal/storage.js'

const SERVER_CONFIG = 'server-config'

export default {
    name: 'server',
    group: groups.settings,
    description: 'server.description',
    usage: 'n/a',
    examples: 'server.examples',
    permissions: [P.ADMINISTRATOR],
    exclude: true
}

export async function obtain(context) {
    return storage.obtain(context, SERVER_CONFIG, {
        bot_id: context.client.user.id,
        server_id: context.guild.id,
        language: 'en',
        prefix: PREFIX
    })
}

export async function save(context, config) {
    return storage.save(context, SERVER_CONFIG, config)
}