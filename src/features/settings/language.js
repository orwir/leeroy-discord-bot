import i18n from 'i18next'
import groups from '../../internal/groups'
import colors from '../../internal/colors'
import { Server, LANGUAGES } from '../../internal/config'
import P from '../../internal/permissions'

const languages = {}

async function initLocalization() {
    return await i18n.init({
        fallbackLng: 'en',
        preload: true,
        resources: LANGUAGES
    })
    .then(t => {
        Object.keys(LANGUAGES)
            .forEach(language => {
                languages[language] = i18n.getFixedT(language)
            })
    })
}

function showSupportedLanguages(msg, t) {
    return msg.channel.send('', {
        embed: {
            title: t('language.supported_languages'),
            description: Object.keys(LANGUAGES).join(', '),
            color: colors.highlightDefault
        }
    })
}

function showLanguageNotSupported(msg, language, t) {
    return msg.channel.send('', {
        embed: {
            title: t('global.error'),
            description: t('language.language_not_supported', { language: language }),
            color: colors.highlightError
        }
    })
}

function showLanguageTheSame(msg, t) {
    return msg.channel.send('', {
        embed: {
            title: t('language.error'),
            description: t('language.language_the_same'),
            color: colors.highlightError
        }
    })
}

export async function obtain(language) {
    return languages[language]
        || await initLocalization().then(() => languages[language])
}

export default {
    name: 'language',
    group: groups.settings,
    description: 'language.description',
    usage: 'language [lang]',
    examples: 'language ru',
    permissions: [P.ADMINISTRATOR],

    handle: async (msg, language) => {
        const config = await Server.config(msg.guild)
        const t = await obtain(config.language)

        if (!language) {
            return await showSupportedLanguages(msg, t)

        } else if (!LANGUAGES[language]) {
            return await showLanguageNotSupported(msg, language, t)

        } else if (language === config.language) {
            return await showLanguageTheSame(msg, t)

        } else {
            config.language = language
            await Server.save(msg.guild)
            return await msg.channel.send('', {
                embed: {
                    title: t('global.success'),
                    description: t('language.language_changed'),
                    color: colors.highlightSuccess
                }
            })
        }
    }
}