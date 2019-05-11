module.exports = {

    token: process.env.executor_auth_token,

    prefix: process.env.executor_prefix || 'e!',

    dev: process.env.executor_dev,

    languages: {
        en: {
            translation: require('../res/locales/en.json')
        },
        ru: {
            translation: require('../res/locales/ru.json')
        }
    }

}