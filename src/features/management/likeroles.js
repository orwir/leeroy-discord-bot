import channel from '../../internal/channel.js'
import colors from '../../internal/colors.js'
import event from '../../internal/event.js'
import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import { register } from '../../internal/register.js'
import { path } from '../../utils/object.js'
import reference from '../../utils/reference.js'
import { error, message } from '../../utils/response.js'
import { verifyRolePosition } from '../../utils/role.js'
import features from '../index.js'
import { man } from '../settings/man.js'

register('likeroles', event.onReaction, channel.text)

export default {
    name: 'likeroles',
    group: groups.management,
    description: 'likeroles.description',
    usage: `likeroles \`create|message_id\`
    [emoji] [@role] [description]
    [emoji] [@role] [description]`,
    examples: 'likeroles.examples',
    arguments: 2,
    permissions: [P.MANAGE_ROLES],

    execute: async (context, action, ...args) => {

        if (!action) {
            return man(context, 'likeroles')
        }

        if (action !== 'create' && isNaN(action)) {
            return man(context, 'likeroles')
        }

        const msg = action === 'create' ? null : await context.channel.messages.fetch(action);

        if (args.length === 0) {
            return man(context, 'likeroles')
        }

        const lines = [] 
        args[0].trimStart('\n').split('\n').forEach((line) => {
            let elements = line.split(' ').filter(x => x !== '')

            if (elements.length < 2) {
                return;
            }

            lines.push({
                emoji: elements[0],
                role: elements[1],
                description: elements.slice(2).join(' ') || ''
            })
        })

        if (lines.length === 0) {
            return man(context, 'likeroles')
        }

        var fields = [ getInitialField() ]
        var emojis = []

        await Promise.all(lines.map(async obj => {
            let emoji = await getEmoji(context, obj.emoji)
            let role = await getRole(context, obj.role)
            let description = obj.description

            if (!verifyRolePosition(context, context.member, role)) {
                return error({
                    context: context,
                    description: context.t('role.role_should_be_lower', { role: role })
                })
            }

            emojis.push(emoji)
            fields.push(getEmojiField(context, emoji))
            fields.push(getRoleField(context, obj.role))
            fields.push(getDescriptionField(context, description))
            return true;
        }))

        let result
        if (msg) {
            var embed = path(msg, 'embeds[0]');
            result = msg.edit({
                embed: {
                    title: embed.title,
                    description: embed.description,
                    color: embed.color,
                    fields: fields
                }
            }).then(message => message.reactions.removeAll())
        }
        else{
            result = message({
                channel: context.channel,
                color: colors.highlightDefault,
                fields: fields
            })
        }

        return result.then(message => {
            emojis.forEach((emoji) => message.react(emoji))
        })
    },

    [event.onReaction]: async (context, user, reacted) => {
        const fields = path(context.message, 'embeds[0].fields')
        const field = fields[0]
        if (!field || field.name !== 'feature') return
        const feature = features[field.value]
        if (!feature || feature.name !== 'likeroles') return

        const emojis = {}
        for (let idx = 1; idx < fields.length; idx += 3) {
            const emoji = fields[idx].value
            const role = await getRole(context.message, fields[idx + 1].value)

            emojis[emoji] = role
        }

        const role = emojis[context.emoji]
        if (!role) return;
        
        const member = await context.message.guild.members.fetch(user)
        if (member) {
            await member.roles[reacted ? 'add' : 'remove'](role)
        }
    },
}

async function getRole(context, text) {
	if (!reference(text)) {
			return;
	}
    return await context.guild.roles.fetch(reference(text))
}

async function getEmoji(context, text) {
    if (!reference(text)) {
        return text;
    }

    return await context.guild.emojis.resolve(reference(text))
}

function getInitialField() {
    return {
        name: 'feature',
        value: 'likeroles',
        inline: false
    }
}

function getRoleField(context, role) {
    return {
        name: context.t('likeroles.role'),
        value: '' + role,
        inline: true
    }
}

function getEmojiField(context, emoji) {
    return {
        name: context.t('likeroles.emoji'),
        value: emoji,
        inline: true
    }
}

function getDescriptionField(context, description) {
    return {
        name: context.t('likeroles.howto'),
        value: description,
        inline: true
    }
}

Object.defineProperty(String.prototype, "trimStart", {
    value: function trimStart(trimText) {
        return this.startsWith(trimText) ? this.slice(trimText.length) : this
    },
    writable: true,
    configurable: true
})