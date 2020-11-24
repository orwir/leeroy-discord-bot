import groups from '../../internal/groups'
import P from '../../internal/permissions'
import { registerTextChannelHandler } from '../../internal/register'
import { message, success } from '../../utils/response'
import { man } from '../settings/man'

const channels = {}
const cooldown = 10 * 1000

registerTextChannelHandler('sentry')

export default {
    name: 'sentry',
    group: groups.management,
    description: 'sentry.description',
    usage: 'sentry [on,off,list]',
    examples: 'sentry.examples',
    arguments: 1,
    permissions: [P.ADMINISTRATOR],

    execute: async (context, state) => {
        if (!state || !['on', 'off', 'list'].includes(state)) {
            return man(context, 'sentry')
        }

        const channel = context.channel
        const guild = context.guild

        if (state === 'on') {
            if (!channels.hasOwnProperty(channel.id)) {
                channels[channel.id] = {
                    id: channel.id,
                    name: channel.name,
                    guildID: guild.id,
                    lastMessage: null
                }
                return success({
                    context: context,
                    description: context.t('sentry.on')
                })
            } else {
                return success({
                    context: context,
                    description: context.t('sentry.already_on')
                })
            }
        }
        if (state === 'off') {
            delete channels[channel.id]
            return success({
                context: context,
                description: context.t('sentry.off')
            })
        }
        if (state === 'list') {
            return success({
                channel: channel,
                title: context.t('sentry.list_title'),
                description: channels.size === 0
                    ? context.t('sentry.no_channels')
                    : Object.values(channels)
                        .filter(observable => observable.guildID === guild.id)
                        .map(observable => `<#${observable.id}>`)
                        .join('\n')
            })
        }
    },

    onMessage: async (context) => {
        const observable = channels[context.channel.id]
        if (!observable) return
        const last = observable.lastMessage
        observable.lastMessage = context

        if (!(last && last.author.id === context.author.id
            && context.createdAt.getTime() - last.createdAt.getTime() < cooldown)) {
            return
        }

        try {
            await Promise.all([last.react('🤡'), context.react('🤡')])
        } catch (error) {
            if (error.code === 90001) {
                await Promise.all([last.delete(), context.delete()]).catch(_ => {})
                await message({
                    channel: context.channel,
                    text: context.t('sentry.user_said', { username: context.author }),
                    description: `${last.content} ${context.content}`
                })
            } else {
                throw error
            }
        }
    }
}