import { GuildMember } from 'discord.js'
import channel from '../../internal/channel.js'
import { devConfig } from '../../internal/config.js'
import event from '../../internal/event.js'
import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import { register } from '../../internal/register.js'
import { success } from '../../utils/response.js'
import { man } from '../settings/man.js'

register('dynvoice', event.onJoinVoice, channel.voice)
register('dynvoice', event.onLeaveVoice, channel.voice)

const _factoryPrefix = devConfig.dynvoice_fprefix || '+'
const _channelPrefix = devConfig.dynvoice_cprefix || '>'
const _factoryTemplate = new RegExp(`^\\${_factoryPrefix} #(\\d+) \\/(.*?)\\/$`)
const _channelTemplate = new RegExp(`^\\${_channelPrefix} (.*)$`)
const _cooldown = 2 * 1000
let _lastUsed = Date.now()

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
        const group = context.guild.channels.resolve(parent)
        const groupName = group ? group.name : context.t('dynvoice.root')
        return context.guild.channels.create(`${_factoryPrefix} #${limit} /${template}/`, {
                type: channel.voice,
                userLimit: 1,
                parent: group
            })
            .then(channel => success({
                context: context,
                description: context.t('dynvoice.factory_created', { name: channel.name, parent: groupName })
            }))
    },

    [event.onJoinVoice]: async (context) => {
        const factory = context.channel.name.match(_factoryTemplate)
        if (!factory || Date.now() - _lastUsed < _cooldown) return
        _lastUsed = Date.now()
        let [ , limit, template ] = factory

        await context.guild.channels.create(`${_channelPrefix} ${await applyTemplate(context, template)}`, {
                type: channel.voice,
                userLimit: limit,
                parent: context.channel.parent,
                permissionOverwrites: context.channel.permissionOverwrites,
                reason: context.t('dynvoice.user_created_channel', { username: context.member.user.tag, nickname: context.member.name()})
            })
            .then(channel => context.setChannel(channel))
    },

    [event.onLeaveVoice]: async (context) => {
        if (_channelTemplate.test(context.channel.name) && !context.channel.members.size) {
            await context.channel.delete()
        }
    }
}

async function applyTemplate(context, template) {
    const playing = context.member.presence.activities.find(a => a.type === 'PLAYING')
    return template
        .replace('<user>', context.member.name())
        .replace('<game>', playing ? playing.name : context.t('dynvoice.chill'))
}

GuildMember.prototype.name = function() {
    return this.nickname ? this.nickname : this.user.username
}