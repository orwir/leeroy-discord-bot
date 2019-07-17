export default async function (msg) {
    console.log(msg.content)
}


// const config = require('../internal/config')
// const colors = require('../internal/colors')
// const server = require('../features/utility/server')
// const language = require('../features/utility/language')
// const debug = require('../features/utility/debug')
// const features = require('../features').get()

// module.exports = async (msg) => {
//     if (msg.author.bot || msg.content.isBlank()) {
//         return
//     }
//     const settings = await server.obtain(msg.guild)
//     const t = await language.obtain(settings.language)
//     let text = msg.content

//     // verify prefix
//     let prefix
//     let onlyStable = false
//     if (text.startsWith(settings.prefix)) {
//         prefix = settings.prefix
//     } else if (text.startsWith(config.prefix)) {
//         prefix = config.prefix
//         onlyStable = true
//     }
//     if (!prefix) {
//         return
//     }
//     text = text.slice(prefix.length).trim()
//     if (text.isBlank()) {
//         return
//     }
    
//     // verify feature
//     let feature
//     let name = text.slice(0, (text.indexOf(' ') > 0) ? text.indexOf(' ') : text.length)
//     text = text.slice(name.length + 1)
//     feature = features[name]
//     if (!feature) {
//         feature = features[settings.aliases[name]]
//     }
//     if (!feature) {
//         msg.channel.send('', {
//             embed: {
//                 title: t('global.command_not_found_title', { name: name }),
//                 description: t('global.command_not_found_description'),
//                 color: colors.highlightError
//             }
//         })
//         return
//     }
//     if (onlyStable && !feature.stable) {
//         return
//     }
//     if (feature.debug && !settings.debug) {
//         return
//     }

//     // resolve arguments
//     let args = []
//     if (feature.arguments) {
//         for (i = 1; i <= feature.arguments && text.length > 0; i++) {
//             let arg
//             if (i < feature.arguments) {
//                 let index = text.indexOf(' ')
//                 arg = text.slice(0, index > 0 ? index : text.length)
//                 text = text.slice(arg.length + 1)
//             } else {
//                 arg = text
//             }
//             args.push(arg)
//         }
//     } else {
//         args = text.split(' ')
//     }

//     try {
//         await feature.action(msg, ...args)
//     } catch (error) {
//         debug.log(error)
//     }

// }