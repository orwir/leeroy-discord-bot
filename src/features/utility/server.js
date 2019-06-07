const global = require('../../global')
const servers = {}

global.features.server = {

    name: 'server',

    group: global.groups.utility,

    description: 'server.description',

    usage: '<no public commands>',

    examples: '<no public commands>',

    action: (msg, option) => {},

    obtain: (id) => servers[id],

    configure: async (guild) => {
        if (servers[guild.id]) {
            return servers[guild.id]
        }
        let config = await global.storage.obtain(guild.id, {
            id: guild.id,
            language: 'en',
            prefix: global.config.prefix,
            debug: 0,
            aliases: {
                help: global.features.wtf.name
            },
            developers: []
        })
        servers[guild.id] = config
        config.t = global.i18n.getFixedT(config.language)

        return config
    },

    save: async (id) => global.storage.save(id, servers[id]),

    delete: async (id) => global.storage.delete(id)

}