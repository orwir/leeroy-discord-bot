import groups from '../../internal/groups'
import colors from '../../internal/colors'
import P from '../../internal/permissions'
import { register } from '../../events/voice'
import { man } from '../settings/man'
import { Presence } from 'discord.js'

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
    group: groups.access,
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
        return context.guild.createChannel(`${FACTORY_PREFIX} #${limit} /${template}/`, {
                type: 'voice',
                userLimit: 1,
                parent: group
            })
            .then(channel => context.channel.send('', {
                embed: {
                    title: context.t('global.success'),
                    description: context.t('dynvoice.factory_created', { name: channel.name, parent: group ? group.name : context.t('dynvoice.root') }),
                    color: colors.highlightSuccess
                }
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
                    permissionOverwrites: channel.permissionOverwrites
                })
                .then(channel => { member.setVoiceChannel(channel) })
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
        .replace('<user>', member.nickname ? member.nickname : member.user.username)
        .replace('<game>', member.presence.playing(member.t))
}

Presence.prototype.playing = function(t) {
    return this.game ? this.game.name : t('dynvoice.chill')
}