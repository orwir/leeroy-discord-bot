import { PREFIX } from '../../internal/config.js'
import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import storage from '../../internal/storage.js'

const _serverCollection = 'server'

export default {
    name: 'server',
    group: groups.system,
    description: 'gobal.na',
    usage: 'n/a',
    examples: 'global.na',
    permissions: [P.ADMINISTRATOR]
}

export async function obtain(guild) {
    const config = await storage.obtain(guild.client, _serverCollection, guild, {})
    
    config.bot_id = config.bot_id || guild.client.user.id
    config.bot_name = config.bot_name || guild.client.user.tag
    config.id = config.id || guild.id
    config.name = config.name || guild.name
    config.language = config.language || 'en'
    config.prefix = config.prefix || PREFIX

    return config
}

export async function save(guild, config) {
    return storage.save(guild.client, _serverCollection, guild, config)
}
