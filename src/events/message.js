const common = require('../common')

module.exports = async (msg) => {
    if (msg.author.bot || msg.content.isBlank()) {
        return
    }
    const config = await common.configureServer(msg.guild)
    let text = msg.content

    // verify prefix
    let prefix
    let onlyStable = false
    if (text.startsWith(config.prefix)) {
        prefix = config.prefix
    } else if (text.startsWith(common.config.prefix)) {
        prefix = common.config.prefix
        onlyStable = true
    }
    if (!prefix) {
        return
    }
    text = text.slice(prefix.length).trim()
    if (text.isBlank()) {
        return
    }
    
    // verify feature
    let feature
    let name = text.slice(0, (text.indexOf(' ') > 0) ? text.indexOf(' ') : text.length)
    text = text.slice(name.length + 1)
    feature = common.features[name]
    if (!feature) {
        feature = common.features[config.aliases[name]]
    }
    if (!feature) {
        msg.channel.send('', {
            embed: {
                title: config.t('global.command_not_found_title', { name: name }),
                description: config.t('global.command_not_found_description'),
                color: common.colors.highlightError
            }
        })
        return
    }
    if (onlyStable && !feature.stable) {
        return
    }
    if (feature.debug && !config.debug) {
        return
    }

    // resolve arguments
    let args = []
    if (feature.arguments) {
        for (i = 1; i <= feature.arguments && text.length > 0; i++) {
            let arg
            if (i < feature.arguments) {
                let index = text.indexOf(' ')
                arg = text.slice(0, index > 0 ? index : text.length)
                text = text.slice(arg.length + 1)
            } else {
                arg = text
            }
            args.push(arg)
        }
    } else {
        args = text.split(' ')
    }

    try {
        feature.action(msg, ...args)
    } catch (error) {
        common.log(msg, error)
    }

}