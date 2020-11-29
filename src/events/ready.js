import features from '../features/index.js'
import event from '../internal/event.js'
import { handlers } from '../internal/register.js'
import { log } from '../utils/response.js'

export default async function (bot) {
    const filter = (handler) => handler.event === event.onReady
    
    try {
        for (const handler of handlers().filter(filter)) {
            await features[handler.feature][handler.event](bot)
                .catch(error => log(bot, error))
        }
    } catch (error) {
        log(bot, error)
    }
}
