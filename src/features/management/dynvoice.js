import groups from '../../internal/groups'
import P from '../../internal/permissions'
import { register } from '../../events/voice'
import { man } from '../settings/man'
import { success } from '../../utils/response'
import { GuildMember } from 'discord.js'

const FACTORY_PREFIX = '+'
const CHANNEL_PREFIX = '>'
const FACTORY_TEMPLATE = /^\+ #(\d+) \/(.*?)\/$/
const CHANNEL_TEMPLATE = /^\> (.*)$/

const COOLDOWN = 2 * 1000
let USED = Date.now()

register('dynvoice', FACTORY_TEMPLATE)
register('dynvoice', CHANNEL_TEMPLATE)

export default {
    name: 'dynvoice',
    group: groups.management,
    description: 'dynvoice.description',
    usage: 'dynvoice [parent id] [limit] [template]',
    examples: 'dynvoice.examples',
    arguments: 3,
    permissions: [P.MANAGE_CHANNELS, P.MOVE_MEMBERS],

    execute: async (context, parent, limit, template) => {
        if (!parent || isNaN(limit) || !template) {
            return man(context, 'dynvoice')
        }
        const group = context.guild.channels.get(parent)
        const groupName = group ? group.name : context.t('dynvoice.root')
        return context.guild.createChannel(`${FACTORY_PREFIX} #${limit} /${template}/`, {
                type: 'voice',
                userLimit: 1,
                parent: group
            })
            .then(channel => success({
                context: context,
                description: context.t('dynvoice.factory_created', { name: channel.name, parent: groupName })
            }))
    },

    onJoin: async (member, channel) => {
        const factory = channel.name.match(FACTORY_TEMPLATE)
        if (factory && Date.now() - USED > COOLDOWN) {
            USED = Date.now()
            let [ , limit, template ] = factory

            return member.guild
                .createChannel(`${CHANNEL_PREFIX} ${applyTemplates(member, template)}`, {
                    type: 'voice',
                    userLimit: limit,
                    parent: channel.parent,
                    permissionOverwrites: channel.permissionOverwrites,
                    reason: member.t('dynvoice.user_created_channel', { username: member.user.tag, nickname: member.name()})
                })
                .then(channel => member.setVoiceChannel(channel))
        }
    },

    onLeave: async (member, channel) => {
        if (CHANNEL_TEMPLATE.test(channel.name) && !channel.members.size) {
            return channel.delete()
        }
    }
}

function applyTemplates(member, template) {
    return template
        .replace('<user>', member.name())
        .replace('<game>', member.playing(member.t))
}

GuildMember.prototype.name = function() {
    return this.nickname ? this.nickname : this.user.username
}

GuildMember.prototype.playing = function(t) {
    const playing = this.presence.activities.find(e => e.type === 0)
    return playing ? playing.name : t('dynvoice.chill')
}