require('../../internal/extensions')
const groups = require('../../internal/groups')
const colors = require('../../internal/colors')
const config = require('../../internal/config')
const server = require('./server')
const i18n = require('i18next')
const languages = {}

module.exports = {
    name: 'language',
    group: groups.utility,
    description: 'language.description',
    usage: 'language [lang]',
    examples: 'language ru',

    action: async (msg, language) => {
        const settings = await server.obtain(msg.guild)
        let t = await obtain(settings.language)

        let embed
        // show supported languages list
        if (!language) {
            embed = {
                title: t('language.list'),
                description: Object.keys(config.languages).join(', '),
                color: colors.highlightDefault
            }

        // language is not supported
        } else if (!config.languages[language]) {
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
            settings.language = language
            server.save(msg.guild.id)
            t = languages[language]
            embed = {
                title: t('language.changed_title'),
                description: t('language.changed_description'),
                color: colors.highlightSuccess
            }
        }

        msg.channel.send('', { embed: embed })
    },

    obtain: obtain
}

async function obtain(lang) {
    return languages[lang]
        || i18n.init({
            fallbackLng: 'en',
            preload: true,
            resources: config.languages
        })
        .then(t => {
            Object.keys(config.languages).forEach(l => {
                languages[l] = i18n.getFixedT(l)
            })
        })
        .then(() => languages[lang])
}