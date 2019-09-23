import groups from '../../internal/groups'
import P from '../../internal/permissions'
import { register } from '../../events/voice'

const FACTORY_TEMPLATE = /\+ #(\d+) \/(.*?)\//g
const CHANNEL_TEMPLATE = /# (.*)/g

register(FACTORY_TEMPLATE, 'dynvoice')
register(CHANNEL_TEMPLATE, 'dynvoice')

export default {
    name: 'dynvoice',
    group: groups.access,
    description: 'dynvoice.description',
    usage: 'dynvoice [parent id] [limit] [template]',
    examples: 'dynvoice.examples',
    arguments: 3,
    permissions: [P.MANAGE_CHANNELS, P.MOVE_MEMBERS],

    execute: async (context, parent, limit, template) => {
        return context.guild.createChannel(`${PREFIX_FACTORY} #${limit} ${template}`, {
            type: 'voice',
            userLimit: limit > 0 ? limit : null,
            parent: parent
        })
    },

    onJoin: async (member, channel) => {
        if (channel.name.startsWith(PREFIX_FACTORY)) {
            return member.guild.createChannel(`${PREFIX_CHANNEL} test`, {
                type: 'voice',
                parent: channel.parent
            })
            .then(channel => {
                member.setVoiceChannel(channel)
            })
        }
    },

    onLeave: async (member, channel) => {
        if (channel.name.startsWith(PREFIX_CHANNEL)) {
            if (!channel.members.length) {
                return channel.delete()
            }
        }
    }
}