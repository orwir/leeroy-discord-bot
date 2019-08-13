import '../internal/extensions'
import { Server } from '../internal/config'
import features from '../features'

export default async function (msg) {
    if (msg.author.bot || msg.content.isBlank()) {
        return
    }

    const prefix = await Server.prefix(msg.guild)
    const request = {
        prefix: undefined,
        feature: undefined,
        args: []
    }
    let raw = msg.content

    switch ("prefix") {

        case "prefix":
            if (raw.startsWith(prefix)) {
                request.prefix = prefix
            } else {
                break
            }

        case "feature":
            const start = request.prefix.length
            const end = raw.indexOf(' ', start) > 0 ? raw.indexOf(' ') : raw.length
            if (start + end > 0) {
                const name = raw.slice(start, end)
                request.feature = features[name]
                if (!request.feature) {
                    break
                }
            } else {
                break
            }
        
        case "arguments":
            let rawargs = raw.slice(`${request.prefix}${request.feature.name} `.length)
            if (!rawargs.isBlank()) {
                if (request.feature.arguments) {
                    for (i = 1; i <= request.feature.arguments && rawargs.length > 0; i++) {
                        let arg
                        if (i < request.feature.arguments) {
                            let index = rawargs.indexOf(' ')
                            arg = rawargs.slice(0, index > 0 ? index : rawargs.length)
                            rawargs = rawargs.slice(arg.length + 1)
                        } else {
                            arg = rawargs
                        }
                        request.args.push(arg)
                    }
                } else {
                    request.args.push(...rawargs.trim().split(' '))
                }
            }
        
        case "handle":
            request.feature
                .handle(msg, ...request.args)
                .catch(error => console.log(error))
    }
}