import groups from '../../internal/groups'
import storage from '../../internal/storage'
const servers = {}

export default {
    name: 'server',
    group: groups.settings,
    description: '',
    usage: '',
    examples: '',

    handle: async () => {},

    obtain: async (guild) => {

    },

    save: async (guild) => {

    },

    remove: async (guild) => storage
        .remove(guild.id)
        .then(() => delete servers[guild.id])
}

/*
require('../../internal/extensions')
const config = require('../../internal/config')
const groups = require('../../internal/groups')
const storage = require('../../internal/storage')
const servers = {}

module.exports = {
    name: 'server',
    group: groups.utility,
    description: 'server.description',
    usage: '<no public commands>',
    examples: '<no public commands>',

    action: async (msg) => {},

    obtain: async (guild) => {
        if (servers[guild.id]) {
            return servers[guild.id]
        }
        return servers[guild.id] = await storage.obtain(guild.id, {
            id: guild.id,
            language: 'en',
            prefix: config.prefix,
            debug: 0,
            aliases: {
                help: 'wtf'
            },
            developers: []
        })
    },

    save: async (id) => storage.save(id, servers[id]),

    delete: async (id) => storage.delete(id)
}
*/