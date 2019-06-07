const global = require('../global')

module.exports = async (bot, data, reacted) => {
    const user = bot.users.get(data.user_id)
    const channel = bot.channels.get(data.channel_id) || await user.createDM()
    const msg = await channel.fetchMessage(data.message_id)
    const tag = msg.path('embeds[0].fields[0].value')
    const emoji = data.emoji.name
    const member = msg.guild.member(user)

    try {
        if (!user.bot && msg.author.id === bot.user.id && tag) {
            await global.configureServer(msg.guild)

            Object.values(global.features)
                .filter(feature => feature.reaction)
                .forEach(feature => {
                    if (feature.name === tag) {
                        if (reacted && !feature.emojis.includes(emoji)) {
                            global.removeReaction(msg, emoji, member)
                        } else {
                            feature.react(msg, emoji, member, reacted)
                        }
                    }
                })
        }
    } catch (error) {
        global.log(msg, error)
    }
}