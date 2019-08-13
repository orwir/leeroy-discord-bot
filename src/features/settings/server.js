import groups from '../../internal/groups'
import storage from '../../internal/storage'
import { PREFIX } from '../../internal/config'

const servers = {}

export default {
    name: 'server',
    group: groups.settings,
    description: 'server.description',
    usage: 'n/a',
    examples: 'n/a',

    handle: async () => {},

    obtain: async (guild) => servers[guild.id]
        || await storage.obtain(guild.id, {
            id: guild.id,
            language: 'en',
            prefix: PREFIX
        }),

    save: async (guild) => storage.save(guild.id, servers[guild.id]),

    remove: async (guild) => storage
        .remove(guild.id)
        .then(() => delete servers[guild.id])
}