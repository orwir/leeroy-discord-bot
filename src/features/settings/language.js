import i18n from 'i18next'
import groups from '../../internal/groups'
import colors from '../../internal/colors'
import P from '../../internal/permissions'
import { Server, LANGUAGES } from '../../internal/config'

const languages = {}

export default {
    name: 'language',
    group: groups.settings,
    description: 'language.description',
    usage: 'language [lang]',
    examples: 'language.examples',
    permissions: [P.ADMINISTRATOR],

    execute: async (context, language) => {
        const config = await Server.config(context)

        if (!language) {
            return showSupportedLanguages(context)

        } else if (!LANGUAGES[language]) {
            return showLanguageNotSupported(context, language)

        } else if (language === config.language) {
            return showLanguageTheSame(context)

        } else {
            config.language = language
            await Server.save(context, config)
            context.t = await obtain(config.language)
            return context.channel.send('', {
                embed: {
                    title: context.t('global.success'),
                    description: context.t('language.language_changed'),
                    color: colors.highlightSuccess
                }
            })
        }
    }
}

export async function obtain(language) {
    return languages[language] || initLocalization().then(() => languages[language])
}

async function initLocalization() {
    return i18n.init({
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

function showSupportedLanguages(context) {
    return context.channel.send('', {
        embed: {
            title: context.t('language.supported_languages'),
            description: Object.keys(LANGUAGES).join(', '),
            color: colors.highlightDefault
        }
    })
}

function showLanguageNotSupported(context, language) {
    return context.channel.send('', {
        embed: {
            title: context.t('global.error'),
            description: context.t('language.language_not_supported', { language: language }),
            color: colors.highlightError
        }
    })
}

function showLanguageTheSame(context) {
    return context.channel.send('', {
        embed: {
            title: context.t('global.error'),
            description: context.t('language.language_the_same'),
            color: colors.highlightError
        }
    })
}