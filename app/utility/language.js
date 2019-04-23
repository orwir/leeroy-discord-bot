const global = require('../global.js')

global.commands.language = {

    name: 'language',

    group: global.groups.utility,

    description: 'languageDescription',

    usage: 'language [lang]',

    examples: 'language ru',

    action: (msg, language) => {
        if (language) {
            const guildConfig = global.config[msg.guild.id]

            guildConfig.t = global.i18n.getFixedT(language)
            global.sendMessage({
                channel: msg.channel,
                embed: {
                    title: guildConfig.t('languageChanged'),
                    description: guildConfig.t('languageChangedDescription', { language: language }),
                    color: global.colors.highlightSuccess
                }
            })
        } else {
            global.commands.man.action(msg, global.commands.language.name)
        }
    }

}