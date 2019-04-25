const colors = require('../res/colors.json')
const i18n = require('i18next')

String.prototype.isBlank = function() {
    return !this || !this.trim()
}

i18n.init({

    lng: 'en',

    fallbackLng: 'en',

    preload: true,

    resources: {
        en: {
            translation: require('../res/locales/en.json')
        },
        ru: {
            translation: require('../res/locales/ru.json')
        }
    }

})

module.exports = {

    // properties
    
    config: require('./config'),

    i18n: i18n,

    guilds: {},
    
    colors: {
        highlightDefault: parseInt(colors.electricViolet),
        highlightSuccess: parseInt(colors.malachite),
        highlightError: parseInt(colors.torchRed)
    },

    groups: {
        fun: {
            name: 'groupFun',
            icon: ':ok_hand:',
            order: 0
        },
        roles: {
            name: 'groupAccess',
            icon: ':busts_in_silhouette:',
            order: 1
        },
        utility: {
            name: 'groupUtility',
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