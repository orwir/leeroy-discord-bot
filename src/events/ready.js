import features from '../features/index.js'
import event from '../internal/event.js'
import { handlers } from '../internal/register.js'

export default async function (bot) {
    handlers()
        .filter(handler => handler.event === event.onReady)
        .forEach(handler => {
            features[handler.feature][handler.event](bot).catch(error => log(bot, error))
        })
}
