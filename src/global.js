require('./extensions')
const colors = require('../res/colors.json')
const config = require('./config')
const i18n = require('i18next')
const features = {}

module.exports =  {

    i18n: i18n,


    storage: {

        save: async (id, object) => {},

        obtain: async (id, def) => def,

        delete: async (id) => {}

    },

    init: () => {
        i18n.init({
            fallbackLng: 'en',
            preload: true,
            resources: config.languages
        })
    },

    configureServer: async (guild) => features.server.configure(guild),

    obtainServerConfig: (id) => features.server.obtain(id),

    saveServerConfig: (id) => features.server.save(id),

    man: (msg, command) => features.man.action(msg, command),

    log: (msg, error) => features.debug.log(msg, error),

    removeReaction: (msg, emoji, member) => {
        msg.reactions
            .find(reaction => reaction.emoji.name === emoji)
            .remove(member)
    }

}