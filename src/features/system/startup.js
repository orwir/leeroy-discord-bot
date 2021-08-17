import { PREFIX } from "../../internal/config.js"
import event from '../../internal/event.js'
import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import { handlers, register } from '../../internal/register.js'
import { log } from '../../utils/response.js'
import features from '../index.js'

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
        try {
            startPeriodicEvents(bot)
        } catch (error) {
            log(bot, error)
        }
        console.log(`${bot.user.tag} has been started.`)
    }
}

function startPeriodicEvents(bot) {
    for (const handler of handlers().filter(handler => handler.event === event.periodic)) {
        if (handler.interval) {
            setInterval(() => {
                features[handler.feature][handler.event](bot)
                    .catch(error => log(bot, error))
            }, handler.interval * 1000)
        }
    }
}
