const colors = require('../res/colors.json')
const config = require('./config')
const i18n = require('i18next')
const storage = require('node-persist')
const commands = {}

String.prototype.isBlank = function() {
    return !this || !this.trim()
}

Object.prototype.path = function(path, defValue) {
    let value = this
    for (let segment of path.split('.')) {
        let index
        if (segment.charAt(segment.length - 1) === ']') {
            index = parseInt(segment.charAt(segment.length - 2))
            segment = segment.slice(0, -3)
        }
        if (segment.charAt(0) === '{') {
            for (let variant of segment.slice(1, -1).split('|')) {
                if (value[variant]) {
                    value = value[variant]
                    break
                }
            }
        } else {
            value = value[segment]
        }
        if (index && Array.isArray(value)) {
            value = value[index]
        }
        if (!value) {
            break
        }
    }
    return value ? value : defValue
}

i18n.init({

    fallbackLng: 'en',

    preload: true,

    resources: config.languages

})
storage.init()

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

    commands: commands,

    // functions

    man: (msg, command) => {
        commands.man.action(msg, command)
    },

    restricted: (guild, command, channel, member) => {
        return !member.hasPermission('ADMINISTRATOR')
    },

    log: (msg, error) => {
        commands.debug.log(msg, error)
    },

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