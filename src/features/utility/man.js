const colors = require('../../internal/colors')
const groups = require('../../internal/groups')
const server = require('../utility/server')
const language = require('../utility/language')

module.exports = {
    name: 'man',
    group: groups.utility,
    description: 'man.description',
    usage: 'man [command]',
    examples: 'man man\nman prefix',
    arguments: 1,

    action: async (msg, name) => {
        const settings = await server.obtain(msg.guild)
        const t = language.get(settings.language)

        // let embed

        // // shows full commands list
        // if (!name) {
        //     embed = {
        //         title: t('man.list'),
        //         color: colors.highlightDefault,
        //         fields: []
        //     }
        //     let group = null
        //     Object.values(global.features)
        //         .filter(feature => !feature.debug || config.debug)
        //         .sort((a, b) => {
        //            if (a.group.order == b.group.order) {
        //                 return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0
        //            } else {
        //                return a.group.order - b.group.order
        //            }
        //         })
        //         .forEach(feature => {
        //             if (group !== feature.group) {
        //                 group = feature.group
        //                 embed.fields.push({
        //                     name: `${feature.group.icon} ${t(feature.group.name)}`,
        //                     inline: true,
        //                     value: ''
        //                 })
        //             }
        //             let last = embed.fields[embed.fields.length - 1]
        //             if (last.value.length > 0) {
        //                 last.value += '\n'
        //             }
        //             last.value += feature.name
        //         })

        // // feature not found
        // } else if (!(global.features[name] || config.aliases[name])) {
        //     embed = {
        //         title: t('global.command_not_found_title'),
        //         description: t('global.command_not_found_description'),
        //         color: colors.highlightError
        //     }

        // // shows user manual for feature
        // } else {
        //     let feature = global.features[name]
        //     if (!feature) {
        //         feature = global.features[config.aliases[name]]
        //     }
        //     embed = {
        //         title: feature.name,
        //         description: t(feature.description),
        //         color: colors.highlightDefault,
        //         fields: [
        //             {
        //                 name: t('man.usage'),
        //                 value: feature.usage,
        //                 inline: true
        //             },
        //             {
        //                 name: t('man.examples'),
        //                 value: feature.examples,
        //                 inline: true
        //             }
        //         ]
        //     }
        // }
        
        // msg.channel.send('', { embed: embed })
    }

}