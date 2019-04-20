const colors = require('../res/colors.json')

module.exports = {
    config: require('../config.js'),
    
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
            title: 'Fun',
            icon: ':ok_hand:',
            order: 0
        },
        roles: {
            title: 'Roles',
            icon: ':busts_in_silhouette:',
            order: 1
        },
        utility: {
            title: 'Utility',
            icon: ':gear:',
            order: 2
        }
    },

    commands: {}, // command: { title: ..., group: ..., action: ... }
}