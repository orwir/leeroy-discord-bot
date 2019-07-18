import '../internal/extensions'
import { Server } from '../internal/config'
import features from '../features'

export default async function (msg) {
    if (msg.author.bot || msg.content.isBlank()) {
        return
    }

    const t = await Server.language(msg.guild)
    const prefix = await Server.prefix(msg.guild)
    const request = {
        prefix: undefined,
        feature: undefined,
        args: []
    }
    let raw = msg.content

    // extract prefix
    {
        if (raw.startsWith(prefix)) {
            request.prefix = prefix
        } else {
            return
        }
        // TODO: stable prefix
    }
    
    // extract feature
    {
        const start = request.prefix.length
        const end = raw.indexOf(' ', start) > 0 ? raw.indexOf(' ') : raw.length
        if (start + end > 0) {
            const name = raw.slice(start, end)
            request.feature = features[name]
            if (!request.feature) {
                return
            }
        } else {
            return
        }
        // TODO: alias
        // TODO: stable prefix
        // TODO: debug
    }

    // extract arguments
    {
        let rawargs = raw.slice(`${request.prefix}${request.feature.name} `.length)
        if (request.feature.arguments) {
            for (i = 1; i <= request.feature.arguments && rawargs.length > 0; i++) {
                let arg
                if (i < request.feature.arguments) {
                    let index = rawargs.indexOf(' ')
                    arg = rawargs.slice(0, index > 0 ? index : rawargs.length)
                    rawargs = rawargs.slice(arg.length + 1)
                }
            }
        }
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
    }
}


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