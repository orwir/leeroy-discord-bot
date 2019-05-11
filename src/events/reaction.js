const common = require('../common')

const commands = common.commands

module.exports = async (bot, data, isAdd) => {
    const author = bot.users.get(data.user_id)
    const channel = bot.channels.get(data.channel_id) || await author.createDM()
    const msg = await channel.fetchMessage(data.message_id)

    if (!author.bot && msg.author.id === bot.user.id) {
        commands.role.update(msg, author, data.emoji.name, isAdd)
    }
}