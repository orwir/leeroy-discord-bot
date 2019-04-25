const common = require('../common')

const guilds = common.guilds
const config = common.config
const commands = common.commands
const i18n = common.i18n

module.exports = {

    configure: (guild) => {
        if (!guilds[guild.id]) {

            guilds[guild.id] = {

                t: i18n.getFixedT('en'),

                prefix: config.prefix,

                aliases: {
                    help: commands.wtf
                },

                developers: []

            }
        }
    }

}