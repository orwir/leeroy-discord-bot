import { PREFIX } from "../../internal/config.js"
import event from '../../internal/event.js'
import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import { register } from '../../internal/register.js'
import { log } from "../../utils/response.js"

register('startup', event.onReady)

export default {
    name: 'startup',
    group: groups.system,
    description: 'global.na',
    usage: 'n/a',
    examples: 'global.na',
    permissions: [P.ADMINISTRATOR],

    [event.onReady]: async (bot) => {
        await bot.user.setPresence({
            status: 'online',
            activity: {
                name: `${PREFIX}help`,
                type: 'PLAYING'
            }
        })
        .catch(error => log(bot, error))
        console.log(`${bot.user.tag} has been started.`)
    }
}
