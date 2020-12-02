import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import * as meta from '../../utils/meta.js'
import { message } from '../../utils/response.js'
import { man } from '../settings/man.js'

const _numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
const _yesno = ['👍', '👎']

export default {
    name: 'poll',
    group: groups.fun,
    description: 'poll.description',
    usage: 'poll [<options number>, yesno] [<your question>]',
    examples: 'poll.examples',
    arguments: 2,
    permissions: [P.MENTION_EVERYONE],
    
    execute: async (context, type, question) => {
        if (!question ||
            (isNaN(type) && type !== 'yesno') ||
            (!isNaN(type) && parseInt(type) <= 0)) {
            return man(context, 'poll')
        }
        const poll = await message({
            channel: context.channel,
            description: question,
            command: 'poll',
            member: context.member,
            footer: { text: meta.compress('poll', { type: type }) }
        })
        if (type === 'yesno') {
            await poll.react('👍')
            await poll.react('👎')
        } else {
            const options = parseInt(type)
            for (let i = 0; i < options; i++) {
                await poll.react(_numbers[i])
            }
        }
    },

    isAllowedEmoji: (message, emoji) => {
        const data = meta.resolve(message)
        if (!data || data.feature !== 'poll') return true
        if (data.type === 'yesno') {
            return _yesno.includes(emoji)
        } else {
            return _numbers.slice(0, _numbers).includes(emoji)
        }
    }
}
