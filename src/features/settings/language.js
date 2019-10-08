import i18n from 'i18next'
import groups from '../../internal/groups'
import colors from '../../internal/colors'
import P from '../../internal/permissions'
import { Server, LANGUAGES } from '../../internal/config'
import { success, error } from '../../utils/response'

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
            return success({
                context: context,
                color: colors.highlightDefault,
                title: context.t('language.supported_languages'),
                description: Object.keys(LANGUAGES).join(', ')
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
            .forEach(language => {
                languages[language] = i18n.getFixedT(language)
            })
    })
}