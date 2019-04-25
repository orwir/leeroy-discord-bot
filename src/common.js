const colors = require('../res/colors.json')
const config = require('./config')
const i18n = require('i18next')

String.prototype.isBlank = function() {
    return !this || !this.trim()
}

i18n.init({

    fallbackLng: 'en',

    preload: true,

    resources: config.languages

})

module.exports = {

    // properties
    
    config: config,

    i18n: i18n,

    guilds: {},
    
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
        roles: {
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

    commands: {},

    // functions

    send: async (args) => {
        return new Promise((resolve, reject) => {
            let promise
            if (args.channel) {
                promise = args.channel.send(args.text, { embed: args.embed })
            }

            if (promise) {
                promise
                    .then(result => resolve(result))
                    .catch(error => reject(error))
            } else {
                reject(new Error('Destination is not passed!'))
            }
        })
    }

}