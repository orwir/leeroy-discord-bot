const global = require('../../global')
const colors = global.colors

global.features.language = {

    name: 'language',

    group: global.groups.utility,

    description: 'language.description',

    usage: 'language [lang]',

    examples: 'language ru',

    action: (msg, language) => {
        const config = global.obtainServerConfig(msg.guild.id)
        let t = config.t
        let embed

        // show supported languages list
        if (!language) {
            embed = {
                title: t('language.list'),
                description: Object.keys(global.config.languages).join(', '),
                color: colors.highlightDefault
            }

        // language is not supported
        } else if (!global.config.languages[language]) {
            embed = {
                title: t('language.error'),
                description: t('language.language_not_supported', { language: language }),
                color: colors.highlightError
            }

        // language is the same
        } else if (language === config.language) {
            embed = {
                title: t('language.error'),
                description: t('language.language_is_same'),
                color: colors.highlightError
            }
        
        // change language
        } else {
            t = global.i18n.getFixedT(language)
            config.t = t
            config.language = language
            global.saveServerConfig(msg.guild.id)
            embed = {
                title: t('language.changed_title'),
                description: t('language.changed_description'),
                color: colors.highlightSuccess
            }
        }

        msg.channel.send('', { embed: embed })
    }

}