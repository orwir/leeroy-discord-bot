const discord = require('discord.js')
const common = require('./common')
const events = require('./events')

require('./commands/utility')
require('./commands/fun')
require('./commands/access')

common.i18n.init({

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

const bot = new discord.Client()
bot.on('message', events.message)
bot.login(common.config.token)