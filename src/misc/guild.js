const common = require('../common')
const persistence = require('./persistence')

const guilds = common.guilds
const config = common.config
const commands = common.commands
const i18n = common.i18n
const obtain = persistence.obtain
const save = persistence.save

module.exports = {

    configure: (guild) => {
        if (!guilds[guild.id]) {

            guilds[guild.id] = obtain(guild.id, {

                language: 'en',

                t: i18n.getFixedT('en'),

                prefix: config.prefix,

                aliases: {
                    help: commands.wtf
                },

                developers: [],

                restrictions: {}

            })
        }
    },

    save: (id) => {
        save(id, guilds[id])
    }

}