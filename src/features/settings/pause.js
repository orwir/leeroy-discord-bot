import colors from '../../internal/colors.js'
import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import { message, success } from '../../utils/response.js'
import { man } from './man.js'

let running = true

export function isRunning() { return running }

export default {
    name: 'pause',
    group: groups.settings,
    description: 'pause.description',
    usage: 'pause [on, off]',
    examples: 'pause.examples',
    arguments: 1,
    permissions: [P.ADMINISTRATOR],

    execute: async (context, state) => {
        if (state && !['on', 'off'].includes(state)) {
            return man(context, 'pause')
        }
        if (state === 'on') {
            running = false
            return success({
                context: context,
                description: context.t('pause.paused'),
                command: 'pause',
                member: context.member
            })
        }
        if (state === 'off') {
            running = true
            return success({
                context: context,
                description: context.t('pause.resumed'),
                command: 'pause',
                member: context.member
            })
        }
        return message({
            channel: context.channel,
            title: context.t('pause.status'),
            description: context.t(running ? 'pause.running' : 'pause.paused'),
            color: running ? colors.highlightSuccess : colors.highlightError,
            command: 'pause',
            member: context.member
        })
    }
}
