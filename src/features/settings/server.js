import groups from '../../internal/groups'
import storage from '../../internal/storage'
import { PREFIX } from '../../internal/config'
import P from '../../internal/permissions'

const servers = {}

export async function obtain(guild) {
    if (!servers[guild.id]) {
        servers[guild.id] = await storage.obtain(guild.id, {
            id: guild.id,
            language: 'en',
            prefix: PREFIX
        })
    }
    return servers[guild.id]
}

export async function save(guild) {
    return storage.save(guild.id, servers[guild.id])
}

export async function remove(guild) {
    return storage.remove(guild.id).then(() => delete servers[guild.id])
}

export default {
    name: 'server',
    group: groups.settings,
    description: 'server.description',
    usage: 'n/a',
    examples: 'server.examples',
    permissions: [P.ADMINISTRATOR],

    handle: async () => {}
}