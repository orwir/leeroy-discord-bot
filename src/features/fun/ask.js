import groups from '../../internal/groups.js'
import reference from '../../utils/reference.js'
import event from '../../internal/event.js'
import { error, message } from '../../utils/response.js'
import { man } from '../settings/man.js'
import { register } from '../../internal/register.js'
import channel from '../../internal/channel.js'

register('ask', event.onMessage, { channel: channel.text })

export default {
    name: 'ask',
    group: groups.fun,
    description: 'ask.description',
    usage: 'ask <@user> <your question>',
    examples: 'ask.examples',
    arguments: 2,

    execute: async (context, userflake, question) => {
        if (!userflake || !question) {
            return man(context, 'ask')
        }

        const member = await context.guild.members.fetch(reference(userflake))
        if (!member) {
            return error({
                context: context,
                description: context.t('ask.member_not_found', { member: userflake }),
                command: 'ask',
                member: context.member
            })
        }
        return message({
            text: `${member}`,
            channel: context.channel,
            title: context.t('ask.question_from'),
            description: `${member} ${question}`,
            footer: { text: 'command: ask' }
        })
    },

    [event.onMessage]: async (message) => {
        if (!message?.reference) return
        const originChannel = await message.client.channels.fetch(message.reference.channelID)
        const originMessage = await originChannel.messages.fetch(message.reference.messageID)

        if (originMessage.embeds[0]?.footer.text !== 'command: ask') return
        if (originMessage.embeds[0].fields.length > 0) return
        if (originMessage.content.indexOf(message.member.id) === -1) return

        originMessage.embeds[0].fields.push({
            name: message.t('ask.answer_from', { member: resolveName(message.member) }),
            value: message.content
        })
        await originMessage.edit(originMessage.embeds)
    }
}

function resolveName(member) {
    return member.nickname || member.user.username
}
