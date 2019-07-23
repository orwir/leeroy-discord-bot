import i18n from 'i18next'
import groups from '../../internal/groups'
import colors from '../../internal/colors'
import { LANGUAGES } from '../../internal/config'
import server from './server'

const languages = {}

async function obtain(language) {
    return languages[language]
        || await i18n.init({
            fallbackLng: 'en',
            preload: true,
            resources: LANGUAGES
        })
        .then(t => Object.keys(LANGUAGES).forEach(lang => {
            languages[lang] = i18n.getFixedT(lang)
        }))
        .then(() => languages[language])
}

function showSupportedLanguages(msg, t) {
    return msg.channel.send('', {
        embed: {
            title: t('language.list'),
            description: Object.keys(LANGUAGES).join(', '),
            color: colors.highlightDefault
        }
    })
}

function showLanguageNotSupported(msg, language, t) {
    return msg.channel.send('', {
        embed: {
            title: t('language.error'),
            description: t('language.language_not_supported', { language: language }),
            color: colors.highlightError
        }
    })
}

function showLanguageTheSame(msg, language, t) {
    return msg.channel.send('', {
        embed: {
            title: t('language.error'),
            description: t('language.language_is_the_same'),
            color: colors.highlightError
        }
    })
}

export default {
    name: 'language',
    group: groups.settings,
    usage: 'language [lang]',
    examples: 'language ru',

    handle: async (msg, language) => {
        const config = await Server.config(msg.guild)
        const t = await obtain(config.language)

        if (!language) {
            return await showSupportedLanguages(msg, t)

        } else if (!LANGUAGES[language]) {
            return await showLanguageNotSupported()

        } else if (language === config.language) {
            return await showLanguageTheSame()

        } else {
            config.language = language
            await server.save(msg.guild)
            return await msg.channel.send('', {
                embed: {
                    title: t('language.changed_title'),
                    description: t('language.changed_description'),
                    color: colors.highlightSuccess
                }
            })
        }
    }
}


/*
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
*/