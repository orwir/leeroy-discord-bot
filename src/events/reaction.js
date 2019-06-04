const common = require('../common')

module.exports = async (bot, data, reacted) => {
    const author = bot.users.get(data.user_id)
    const channel = bot.channels.get(data.channel_id) || await author.createDM()
    const msg = await channel.fetchMessage(data.message_id)

    try {
        if (!author.bot && msg.author.id === bot.user.id) {
            common.updateRole(msg, author, data.emoji.name, reacted)
        }
    } catch (error) {
        common.log(msg, error)
    }
}