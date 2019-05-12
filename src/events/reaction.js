const common = require('../common')

const commands = common.commands
const log = common.log

module.exports = async (bot, data, isAdd) => {
    const author = bot.users.get(data.user_id)
    const channel = bot.channels.get(data.channel_id) || await author.createDM()
    const msg = await channel.fetchMessage(data.message_id)

    try {
        if (!author.bot && msg.author.id === bot.user.id) {
            commands.role.update(msg, author, data.emoji.name, isAdd)
        }
    } catch (error) {
        log(msg, error)
    }
}