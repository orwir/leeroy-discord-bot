import groups from '../../internal/groups'
import P from '../../internal/permissions'
import { register } from '../../events/voice'

const FACTORY_TEMPLATE = /^\+ #(\d+) \/(.*?)\/$/
const CHANNEL_TEMPLATE = /^# (.*)$/

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
        return context.guild.createChannel(`+ #${limit} /${template}/`, {
            type: 'voice',
            userLimit: limit,
            parent: parent
        })
    },

    onJoin: async (member, channel) => {
        const data = channel.name.match(FACTORY_TEMPLATE)
        if (!data) {
            return
        }
        let [ , limit, template ] = data

        return member.guild
            .createChannel(`# ${template}`, {
                type: 'voice',
                userLimit: limit,
                parent: channel.parent
            })
            .then(channel => { member.setVoiceChannel(channel) })
    },

    onLeave: async (member, channel) => {
        if (CHANNEL_TEMPLATE.test(channel.name) && !channel.members.length) {
            return channel.delete()
        }
    }
}