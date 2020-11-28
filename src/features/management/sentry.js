import channel from '../../internal/channel.js'
import colors from '../../internal/colors.js'
import event from '../../internal/event.js'
import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import { register } from '../../internal/register.js'
import storage from '../../internal/storage.js'
import { hasOnlyEmojis } from '../../utils/emoji.js'
import { message as response, success } from '../../utils/response.js'
import { man } from '../settings/man.js'

register('sentry', event.onReady)
register('sentry', event.onMessage, channel.text)

const _config = {}
const _channels = {}
const _cooldown = 5 * 1000
const _emoji = '🤡'
const _sentryCollection = 'sentry'

export default {
    name: 'sentry',
    group: groups.management,
    description: 'sentry.description',
    usage: 'sentry [on, off]',
    examples: 'sentry.examples',
    arguments: 1,
    permissions: [P.ADMINISTRATOR],
    
    execute: async (context, state) => {
        if (state && !['on', 'off'].includes(state)) {
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
                return saveChannels(context)
                    .then(_ => success({
                        context: context,
                        description: context.t('sentry.on'),
                        command: 'sentry',
                        member: context.member
                    }))
            } else {
                return success({
                    context: context,
                    description: context.t('sentry.already_on'),
                    command: 'sentry',
                    member: context.member
                })
            }
        }
        if (state === 'off') {
            delete _channels[channel.id]
            return saveChannels(context)
                .then(_ => success({
                    context: context,
                    description: context.t('sentry.off'),
                    command: 'sentry',
                    member: context.member
                }))
        }
        const description = Object.getOwnPropertyNames(_channels).length
            ? Object.values(_channels)
                .filter(channel => channel.guildID === guild.id)
                .map(channel => `<#${channel.id}>`)
                .join('\n')
            : context.t('sentry.no_channels')

        return response({
            channel: channel,
            title: context.t('sentry.list_title'),
            description: description,
            command: 'sentry',
            member: context.member
        })
    },

    [event.onMessage]: async (message) => {
        const channel = _channels[message.channel.id]
        if (!channel) return
        const last = channel.lastMessage
        channel.lastMessage = message

        if (!last || last.author.id !== message.author.id) return
        if (message.createdAt - last.createdAt > _cooldown) return
        if (hasOnlyEmojis(last.content) !== hasOnlyEmojis(message.content)) return

        try {
            const emoji = (_config[message.guild.id] || {}).emoji || _emoji
            await Promise.all([message.react(emoji), last.react(emoji)])
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
            } else {
                throw error
            }
        }
    },

    [event.onReady]: async (bot) => {
        const saved = await storage.obtain(bot, _sentryCollection) || []
        
        saved.forEach(config => {
            _config[config.id] = {
                emoji: config.emoji
            }
            config.channels.forEach(channel => {
                _channels[channel.id] = {
                    id: channel.id,
                    name: channel.name,
                    guildID: config.id,
                    lastMessage: null
                }
            })
        })
    }
}

async function saveChannels(context) {
    await storage.save(context.client, _sentryCollection, context.guild, {
        bot_id: context.client.user.id,
        bot_name: context.client.user.tag,
        id: context.guild.id,
        name: context.guild.name,
        emoji: (_config[context.guild.id] || {}).emoji || _emoji,
        channels: Object.values(_channels)
                .filter(channel => channel.guildID === context.guild.id)
                .map(channel => { return {
                    id: channel.id,
                    name: channel.name
                }})
    })
}
