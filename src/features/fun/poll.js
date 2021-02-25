import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import { man } from '../settings/man.js'

const _numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
const _yesno = ['👍', '👎']

export default {
    name: 'poll',
    group: groups.fun,
    description: 'poll.description',
    usage: 'poll <your question>\n[<variants>]',
    examples: 'poll.examples',
    arguments: 1,
    permissions: [P.MENTION_EVERYONE],

    execute: async (context, data) => {
        if (!data) return man(context, 'poll')

        data = data.split('\n')
        const question = data[0]
        const variants = data.slice(1)

        if (!variants.length) {
            return context.channel.send(question)
                .then(message => message.react(_yesno[0]).then(() => message))
                .then(message => message.react(_yesno[1]))
        }

        if (variants.length > 9) return man(context, 'poll')

        let text = `${question}`
        for (let i = 0; i < variants.length; i++) {
            text += '\n'
            text += `${_numbers[i]}  ${variants[i]}`
        }

        const message = await context.channel.send(text)
        for (const index in variants) {
            await message.react(_numbers[index])
        }
    },
}
