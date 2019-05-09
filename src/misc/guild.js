const common = require('../common')
const persistence = require('./persistence')

const guilds = common.guilds
const config = common.config
const commands = common.commands
const i18n = common.i18n
const obtain = persistence.obtain
const save = persistence.save

module.exports = {

    configure: async (guild) => {
        if (!guilds[guild.id]) {

            let guildConfig = await obtain(guild.id, {

                language: 'en',

                prefix: config.prefix,

                aliases: {
                    help: commands.wtf.name
                },

                developers: [],

                restrictions: {}

            })
            guilds[guild.id] = guildConfig
            
            guildConfig.t = i18n.getFixedT(guildConfig.language)
        }
    },

    save: (id) => save(id, guilds[id])

}