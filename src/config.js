module.exports = {

    token: process.env.executor_auth_token,

    prefix: process.env.executor_prefix || 'e!',

    languages: {
        en: {
            translation: require('../res/locales/en.json')
        },
        ru: {
            translation: require('../res/locales/ru.json')
        }
    },

    vesrion: require('fs').readFileSync('./VERSION', 'utf8')

}