import channel from '../../internal/channel'
import colors from '../../internal/colors'
import event from '../../internal/event'
import groups from '../../internal/groups'
import P from '../../internal/permissions'
import { register } from '../../internal/register'
import { message as response, success } from '../../utils/response'
import { man } from '../settings/man'

register('sentry', channel.text, event.onMessage)

const _channels = {}
const _cooldown = 5 * 1000

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
            if (!_channels.hasOwnProperty(channel.id)) {
                _channels[channel.id] = {
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
            delete _channels[channel.id]
            return success({
                context: context,
                description: context.t('sentry.off')
            })
        }
        if (state === 'list') {
            return success({
                channel: channel,
                title: context.t('sentry.list_title'),
                description: _channels.size === 0
                    ? context.t('sentry.no_channels')
                    : Object.values(_channels)
                        .filter(observable => observable.guildID === guild.id)
                        .map(observable => `<#${observable.id}>`)
                        .join('\n')
            })
        }
    },

    [event.onMessage]: async (message) => {
        const observable = _channels[message.channel.id]
        if (!observable) return
        const last = observable.lastMessage
        observable.lastMessage = message

        if (!(last && last.author.id === message.author.id
            && message.createdAt.getTime() - last.createdAt.getTime() < _cooldown)) {
            return
        }

        try {
            await Promise.all([message.react('🤡'), last.react('🤡')]).catch(error => log(message, error))
        } catch (error) {
            if (error.code === 90001) {
                await Promise
                    .all([last.delete(), message.delete()])
                    .then(_ => response({
                        channel: message.channel,
                        text: message.t('sentry.user_said', { username: message.author }),
                        description: `${last.content} ${message.content}`,
                        color: colors.highlightDefault
                    }))
                    .catch(error => log(message, error))
            }
        }
    }
}