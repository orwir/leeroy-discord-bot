import i18n from 'i18next'
import colors from '../../internal/colors.js'
import { LANGUAGES, Server } from '../../internal/config.js'
import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import { error, message, success } from '../../utils/response.js'

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
            return message({
                channel: context.channel,
                title: context.t('language.supported_languages'),
                description: Object.keys(LANGUAGES).join(', '),
                color: colors.highlightDefault
            })
        } else if (!LANGUAGES[language]) {
            return error({
                context: context,
                description: context.t('language.language_not_supported', { language: language })
            })
        } else if (language === config.language) {
            return error({
                context: context,
                description: context.t('language.language_the_same')
            })
        } else {
            config.language = language
            await Server.save(context, config)
            context.t = await obtain(config.language)
            
            return success({
                context: context,
                description: context.t('language.language_changed')
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
            .forEach(language => { languages[language] = i18n.getFixedT(language) })
    })
}