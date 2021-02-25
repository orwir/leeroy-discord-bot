import channel from '../../internal/channel.js'
import colors from '../../internal/colors.js'
import event from '../../internal/event.js'
import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import { register } from '../../internal/register.js'
import { unicodeEmojis } from '../../utils/emoji.js'
import reference from '../../utils/reference.js'
import { error, message } from '../../utils/response.js'
import { canSetRole } from '../../utils/role.js'
import { resolve } from '../index.js'
import { man } from '../settings/man.js'

register('likerole', event.onReaction, channel.text)

const _roleLine = /([^\s]+)\s+([^\s]+)\s*?(.*)/i

export default {
    name: 'likerole',
    group: groups.management,
    description: 'likerole.description',
    usage: 'likerole [create,<message id>]\n<emoji1> @<role1> [<description1>]\n<emoji2> @<role2> [<description2>]',
    examples: 'likerole.examples',
    arguments: 2,
    permissions: [P.MANAGE_ROLES],

    execute: async (context, action, data) => {
        if (!action || !data || !data.trim().length || (action !== 'create' && isNaN(action))) {
            return man(context, 'likerole')
        }
        // TODO: send error if data lines more than 20

        const modified = action === 'create' ? null : await context.channel.messages.fetch(action)
        // TODO: send error if modified is not a this bot message

        if (action !== 'create' && !modified) {
            return man(context, 'likerole')
        }

        const fields = [
            {
                name: context.t('likerole.emoji'),
                value: '',
                inline: true,
            },
            {
                name: context.t('likerole.role'),
                value: '',
                inline: true,
            },
            {
                name: context.t('likerole.desc'),
                value: '',
                inline: true,
            }
        ]

        // TODO: send error if some(any) of role lines are failed to parse
        const emojis = []
        await Promise.all(data.split('\n').map(async (line) => {
            const values = line.match(_roleLine)

            const emoji = await getEmoji(context, values[1])
            const role = await getRole(context, values[2])
            const description = values[3]

            if (!emoji || !role || !canSetRole(context, role)) {
                return
            }
            emojis.push(emoji)

            if (fields[0].value) fields[0].value += '\n'
            fields[0].value += `${emoji}`

            if (fields[1].value) fields[1].value += '\n'
            fields[1].value += `${role}`

            if (fields[2].value) fields[2].value += '\n'
            fields[2].value += description
        }))

        let result
        if (modified) {
            result = modified.edit({
                embed: {
                    fields: fields,
                    title: '__likerole__',
                    color: colors.highlightDefault,
                }
            }).then(message => message.reactions.removeAll())
        } else {
            result = message({
                channel: context.channel,
                fields: fields,
                title: '__likerole__',
                color: colors.highlightDefault,
            })
        }
        return result.then(message => Promise.all(emojis.map(emoji => message.react(emoji))))
    },

    [event.onReaction]: async (reaction, user, reacted) => {
        if (!reaction.message.author.bot) return
        if (reaction.message.embeds[0].title !== '__likerole__') return

        const emojis = reaction
            .message
            .embeds[0]
            .fields[0]
            .value
            .split('\n')

        const roles = reaction
            .message
            .embeds[0]
            .fields[1]
            .value
            .split('\n')

        const index = emojis.findIndex(emoji => emoji === reaction.emoji.toString())
        if (index === -1) return

        const role = await getRole(reaction.message, roles[index])
        if (!role) return

        const member = await reaction.message.guild.members.fetch(user)
        if (!member) return

        await member.roles[reacted ? 'add' : 'remove'](role)
    }
}

async function getEmoji(context, raw) {
    if (unicodeEmojis.test(raw)) return raw
    if (!reference(raw)) return
    return await context.guild.emojis.resolve(reference(raw))
}

async function getRole(context, raw) {
    if (!reference(raw)) return
    return await context.guild.roles.fetch(reference(raw))
}
