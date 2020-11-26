import { PREFIX } from "../internal/config.js"
import { log } from "../utils/response.js"

export default async function (bot) {
    bot.user.setPresence({
            status: 'online',
            activity: {
                name: `${PREFIX}help`,
                type: 'PLAYING'
            }
        })
        .catch(error => log(bot, error))
    console.log(`${bot.user.tag} has been started.`)
}
