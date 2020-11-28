import { PREFIX } from '../../internal/config.js'
import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import storage from '../../internal/storage.js'

const _serverCollection = 'server'

export default {
    name: 'server',
    group: groups.system,
    description: 'server.description',
    usage: 'n/a',
    examples: 'server.examples',
    permissions: [P.ADMINISTRATOR]
}

export async function obtain(context) {
    const config = await storage.obtain(context.client, _serverCollection, context.guild, {})
    
    config.bot_id = config.bot_id || context.client.user.id
    config.bot_name = config.bot_name || context.client.user.tag
    config.server_id = config.server_id || context.guild.id
    config.server_name = config.server_name || context.guild.name
    config.language = config.language || 'en'
    config.prefix = config.prefix || PREFIX

    return config
}

export async function save(context, config) {
    return storage.save(context.client, _serverCollection, context.guild, config)
}
