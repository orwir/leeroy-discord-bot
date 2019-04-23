const common = require('../../common')

const commands = common.commands
const groups = common.groups
const guilds = common.guilds
const i18n = common.i18n
const colors = common.colors
const send = common.send

commands.language = {

    name: 'language',

    group: groups.utility,

    description: 'languageDescription',

    usage: 'language [lang]',

    examples: 'language ru',

    action: (msg, language) => {
        if (language) {
            const t = i18n.getFixedT(language)
            guilds[msg.guild.id] = t

            send({
                channel: msg.channel,
                embed: {
                    title: t('languageChanged'),
                    description: t('languageChangedDescription', { language: language }),
                    color: colors.highlightSuccess
                }
            })
        } else {
            commands.man.action(msg, 'language')
        }
    }

}