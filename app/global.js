const colors = require('../res/colors.json')

String.prototype.isBlank = function() {
    return !this || !this.trim()
}

module.exports = {
    
    config: require('../config.js'),

    i18n: require('i18next'),
    
    colors: {
        highlightDefault: parseInt(colors.electricViolet),
        highlightSuccess: parseInt(colors.malachite),
        highlightError: parseInt(colors.torchRed)
    },

    events: {
        message: 'message'
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

    developers: [],

    sendMessage: (args) => {
        if (args.channel) {
            return args.channel.send(args.text, { embed: args.embed })
        }
        return new Promise()
    }
}