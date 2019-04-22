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
            name: 'Fun',
            icon: ':ok_hand:',
            order: 0
        },
        roles: {
            name: 'Roles',
            icon: ':busts_in_silhouette:',
            order: 1
        },
        utility: {
            name: 'Utility',
            icon: ':gear:',
            order: 2
        }
    },

    commands: {},

    developers: []
}