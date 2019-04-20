const colors = require('../res/colors.json')

module.exports = {
    CONFIG: require('../config.js'),
    COMMANDS: {},
    
    COLORS: {
        MSG_DEFAULT: parseInt(colors.electric_violet),
        MSG_SUCCESS: parseInt(colors.malachite),
        MSG_ERROR: parseInt(colors.torch_red)
    }
}