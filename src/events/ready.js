import { PREFIX } from "../internal/config"

export default async function (bot) {
    bot.user.setPresence({ game: {
        name: `${PREFIX}help`,
        type: 'PLAYING'
    }})
    console.log(`${bot.user.tag} has been started.`)
}
