import { GuildMember } from 'discord.js'
import channel from '../../internal/channel'
import event from '../../internal/event'
import groups from '../../internal/groups'
import P from '../../internal/permissions'
import { register } from '../../internal/register'
import { log, success } from '../../utils/response'
import { man } from '../settings/man'

register('dynvoice', channel.voice, event.onJoinVoice)
register('dynvoice', channel.voice, event.onLeaveVoice)

// const FACTORY_PREFIX = '+'
// const CHANNEL_PREFIX = '>'
// const FACTORY_TEMPLATE = /^\+ #(\d+) \/(.*?)\/$/
// const CHANNEL_TEMPLATE = /^\> (.*)$/

// const COOLDOWN = 2 * 1000
// let USED = Date.now()

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
                type: channel.voice,
                userLimit: 1,
                parent: group
            })
            .then(channel => success({
                context: context,
                description: context.t('dynvoice.factory_created', { name: channel.name, parent: groupName })
            }))
    },

    [event.onJoinVoice]: async (member) => {
        const factory = member.voiceChannel.name.match(FACTORY_TEMPLATE)
        if (!factory || Date.now() - USED - COOLDOWN) return
        USED = Date.now()
        let [ , limit, template ] = factory

        await member.guild.createChannel(`${CHANNEL_PREFIX} ${_template(member, template)}`, {
                type: channel.voice,
                userLimit: limit,
                parent: member.voiceChannel.parent,
                permissionOverwrites: member.voiceChannel.permissionOverwrites,
                reason: member.t('dynvoice.user_created_channel', { username: member.user.tag, nickname: member.name()})
            })
            .then(channel => member.setVoiceChannel(channel))
            .catch(error => log(member, error))
    },

    [event.onLeaveVoice]: async (member) => {
        if (CHANNEL_TEMPLATE.test(member.voiceChannel.name) && !member.voiceChannel.members.size) {
            await member.voiceChannel.delete().catch(error => log(member, error))
        }
    }
}

function _template(member, template) {
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