import features from '../features/index.js'
import event from '../internal/event.js'
import { handlers } from '../internal/register.js'
import { log } from '../utils/response.js'
import cron from 'node-cron'

export default async function (bot) {
    const isOnReady = (handler) => handler.event === event.onReady
    const isPeriodic = (handler) => handler.event === event.periodic
    const runFeature = (handler) => features[handler.feature][handler.event](bot)
        .catch(error => log(bot, `handler: ${handler.feature}.${handler.event}, error: ${error.stack}}`))

    await Promise.all(handlers().filter(isOnReady).map(runFeature))
    await Promise.all(handlers().filter(isPeriodic).map(handler => {
        cron.schedule(handler.schedule, () => { runFeature(handler) })
    }))
}
