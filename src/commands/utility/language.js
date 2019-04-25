const common = require('../../common')

const commands = common.commands
const groups = common.groups
const guilds = common.guilds
const i18n = common.i18n
const languages = common.config.languages
const colors = common.colors
const send = common.send

commands.language = {

    name: 'language',

    group: groups.utility,

    description: 'language.description',

    usage: 'language [lang]',

    examples: 'language ru',

    action: (msg, language) => {
        const guild = guilds[msg.guild.id]
        let t = guild.t
        let embed

        // show supported languages list
        if (!language) {
            embed = {
                title: t('language.listTitle'),
                description: Object.keys(languages).join(', '),
                color: colors.highlightDefault
            }

        // language is not supported
        } else if (!languages[language]) {
            embed = {
                title: t('language.errorTitle'),
                description: t('language.errorLanguageNotSupported', { language: language }),
                color: colors.highlightError
            }

        // language is the same
        } else if (language === guild.language) {
            embed = {
                title: t('language.errorTitle'),
                description: t('language.errorLanguageSame'),
                color: colors.highlightError
            }
        
        // change language
        } else {
            t = i18n.getFixedT(language)
            guild.t = t
            guild.language = language
            embed = {
                title: t('language.changedTitle'),
                description: t('language.changedDescription'),
                color: colors.highlightSuccess
            }
        }

        send({ channel: msg.channel, embed: embed })
    }

}