const common = require('../../common')
const servers = {}

common.features.server = {

    name: 'server',

    group: common.groups.utility,

    description: 'server.description',

    usage: '<no public commands>',

    examples: '<no public commands>',

    action: (msg, option) => {},

    obtain: (id) => servers[id],

    configure: async (guild) => {
        if (servers[guild.id]) {
            return servers[guild.id]
        }
        let config = await common.storage.obtain(guild.id, {
            id: guild.id,
            language: 'en',
            prefix: common.config.prefix,
            debug: 0,
            aliases: {
                help: common.features.wtf.name
            },
            developers: []
        })
        servers[guild.id] = config
        config.t = common.i18n.getFixedT(config.language)

        return config
    },

    save: async (id) => common.storage.save(id, servers[id]),

    delete: async (id) => common.storage.delete(id)

}