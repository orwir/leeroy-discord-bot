require('./extensions')
const colors = require('../res/colors.json')
const config = require('./config')
const i18n = require('i18next')
const features = {}

module.exports =  {

    config: config,
    
    i18n: i18n,

    colors: {
        highlightDefault: parseInt(colors.electricViolet),
        highlightSuccess: parseInt(colors.malachite),
        highlightError: parseInt(colors.torchRed)
    },

    groups: {
        fun: {
            name: 'group.fun',
            icon: ':ok_hand:',
            order: 0
        },
        access: {
            name: 'group.access',
            icon: ':busts_in_silhouette:',
            order: 1
        },
        utility: {
            name: 'group.utility',
            icon: ':gear:',
            order: 2
        }
    },

    features: features,

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