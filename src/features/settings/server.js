import groups from '../../internal/groups'
import storage from '../../internal/storage'
import P from '../../internal/permissions'
import { PREFIX } from '../../internal/config'

const SERVER_CONFIG = 'server-config'

export default {
    name: 'server',
    group: groups.settings,
    description: 'server.description',
    usage: 'n/a',
    examples: 'server.examples',
    permissions: [P.ADMINISTRATOR],

    execute: async (context) => {}
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