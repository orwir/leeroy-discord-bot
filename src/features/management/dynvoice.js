import type from '../../internal/channel.js'
import { devConfig, Server } from '../../internal/config.js'
import event from '../../internal/event.js'
import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import { register } from '../../internal/register.js'
import { log, success } from '../../utils/response.js'
import { man } from '../settings/man.js'

register('dynvoice', event.periodic, { schedule: '*/10 * * * * *' })
register('dynvoice', event.onJoinVoice, { channel: type.voice })
register('dynvoice', event.onLeaveVoice, { channel: type.voice })

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
    usage: 'dynvoice [<category id>] [<limit>] [<template>]',
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
            type: type.voice,
            userLimit: 1,
            parent: group
        })
            .then(channel => success({
                context: context,
                description: context.t('dynvoice.factory_created', { name: channel.name, parent: groupName }),
                command: 'dynvoice',
                member: context.member
            }))
    },

    [event.periodic]: async (bot) => {
        for (const guild of bot.guilds.cache.array()) {
            const language = await Server.language(guild)
            for (const channel of guild.channels.cache.array()) {
                if (channel.members.size) {
                    await createVoiceChannel(guild, channel, channel.members.first(), language)
                        .catch(error => log(bot, error))
                } else {
                    await deleteChannelIfEmpty(channel).catch(error => log(bot, error))
                }
            }
        }
    },

    [event.onJoinVoice]: async (context) => {
        await createVoiceChannel(context.guild, context.channel, context.member, context.t)
    },

    [event.onLeaveVoice]: async (context) => {
        await deleteChannelIfEmpty(context.channel)
    }
}

async function createVoiceChannel(guild, channel, member, language) {
    const factory = channel.name.match(_factoryTemplate)
    if (!factory || Date.now() - _lastUsed < _cooldown) return
    _lastUsed = Date.now()
    let [, limit, template] = factory

    await guild.channels.create(`${_channelPrefix} ${await applyTemplate(member, template, language)}`, {
        type: type.voice,
        userLimit: limit,
        parent: channel.parent,
        permissionOverwrites: channel.permissionOverwrites,
        reason: language('dynvoice.user_created_channel', { username: member.user.tag, nickname: resolveName(member) })
    })
        .then(channel => member.voice.setChannel(channel))
}

async function deleteChannelIfEmpty(channel) {
    if (channel && _channelTemplate.test(channel.name) && !channel.members.size) {
        await channel.delete()
    }
}

async function applyTemplate(member, template, language) {
    const playing = member.presence.activities.find(a => a.type === 'PLAYING')
    return template
        .replace('<user>', resolveName(member))
        .replace('<game>', playing ? playing.name : language('dynvoice.chill'))
}

function resolveName(member) {
    return member.nickname || member.user.nickname
}
