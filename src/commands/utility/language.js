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

    description: 'language.description',

    usage: 'language [lang]',

    examples: 'language ru',

    action: (msg, language) => {
        if (language) {
            const t = i18n.getFixedT(language)
            guilds[msg.guild.id].t = t
            guilds[msg.guild.id].language = language

            send({
                channel: msg.channel,
                embed: {
                    title: t('language.changedTitle'),
                    description: t('language.changedDescription', { language: language }),
                    color: colors.highlightSuccess
                }
            })
        } else {
            commands.man.action(msg, 'language')
        }
    }

}