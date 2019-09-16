import './extensions'
import colors from './colors'
import { Server } from './config'

function missing(user, guild, channel, permissions) {
    return channel
        .permissionsFor(guild.member(user))
        .missing(permissions.map(p => p.name))
}

async function sendMissingPermissions(channel, message, missing, t) {
    return await channel.send(message, {
        embed: {
            title: t('permissions.missing_permissions'),
            description: missing.map(p => t(`permissions.${p}`)).join('\n'),
            color: colors.highlightError
        }
    })
}

export const MISSING_PERMISSIONS = 'MISSING_PERMISSIONS'

export async function verifyBotPermissions(msg, request) {
    const core = missing(msg.client.user, msg.guild, msg.channel, REQUIRED)
    if (core.length) {
        const t = await Server.language(msg.guild)
        await sendMissingPermissions(
            await msg.author.createDM(),
            t('permissions.bot_requires_core_permissions', { channel: msg.channel.name, server: msg.guild.name }),
            core,
            t
        )
        throw MISSING_PERMISSIONS
    }
    const feature = missing(msg.client.user, msg.guild, msg.channel, request.feature.permissions)
        .filter(p => p !== PERMISSIONS.ADMINISTRATOR.name)
    if (feature.length) {
        const t = await Server.language(msg.guild)
        await sendMissingPermissions(msg.channel, t('permissions.bot_requires_permissions'), feature, t)
        throw MISSING_PERMISSIONS
    }
    return request
}

export async function verifyUserPermissions(msg, request) {
    const user = missing(msg.author, msg.guild, msg.channel, request.feature.permissions)
    if (user.length) {
        const t = await Server.language(msg.guild)
        await sendMissingPermissions(
            await msg.author.createDM(),
            t('permissions.user_requires_permissions', { channel: msg.channel.name, server: msg.guild.name }),
            core,
            t
        )
        throw MISSING_PERMISSIONS
    }
    return request
}

export const PERMISSIONS = {
    CREATE_INSTANT_INVITE: {
        name: 'CREATE_INSTANT_INVITE',
        value: 0x00000001
    },
    KICK_MEMBERS: {
        name: 'KICK_MEMBERS',
        value: 0x00000002
    },
    BAN_MEMBERS: {
        name: 'BAN_MEMBERS',
        value: 0x00000004
    },
    ADMINISTRATOR: {
        name: 'ADMINISTRATOR',
        value: 0x00000008
    },
    MANAGE_CHANNELS: {
        name: 'MANAGE_CHANNELS',
        value: 0x00000010
    },
    MANAGE_GUILD: {
        name: 'MANAGE_GUILD',
        value: 0x00000020
    },
    ADD_REACTIONS: {
        name: 'ADD_REACTIONS',
        value: 0x00000040
    },
    VIEW_AUDIT_LOG: {
        name: 'VIEW_AUDIT_LOG',
        value: 0x00000080
    },
    VIEW_CHANNEL: {
        name: 'VIEW_CHANNEL',
        value: 0x00000400
    },
    SEND_MESSAGES: {
        name: 'SEND_MESSAGES',
        value: 0x00000800
    },
    SEND_TTS_MESSAGES: {
        name: 'SEND_TTS_MESSAGES',
        value: 0x00001000
    },
    MANAGE_MESSAGES: {
        name: 'MANAGE_MESSAGES',
        value: 0x00002000
    },
    EMBED_LINKS: {
        name: 'EMBED_LINKS',
        value: 0x00004000
    },
    ATTACH_FILES: {
        name: 'ATTACH_FILES',
        value: 0x00008000
    },
    READ_MESSAGE_HISTORY: {
        name: 'READ_MESSAGE_HISTORY',
        value: 0x00010000
    },
    MENTION_EVERYONE: {
        name: 'MENTION_EVERYONE',
        value: 0x00020000
    },
    USE_EXTERNAL_EMOJIS: {
        name: 'USE_EXTERNAL_EMOJIS',
        value: 0x00040000
    },
    CONNECT: {
        name: 'CONNECT',
        value: 0x00100000
    },
    SPEAK: {
        name: 'SPEAK',
        value: 0x00200000
    },
    MUTE_MEMBERS: {
        name: 'MUTE_MEMBERS',
        value: 0x00400000
    },
    DEAFEN_MEMBERS: {
        name: 'DEAFEN_MEMBERS',
        value: 0x00800000
    },
    MOVE_MEMBERS: {
        name: 'MOVE_MEMBERS',
        value: 0x01000000
    },
    USE_VAD: {
        name: 'USE_VAD',
        value: 0x02000000
    },
    PRIORITY_SPEAKER: {
        name: 'PRIORITY_SPEAKER',
        value: 0x00000100
    },
    STREAM: {
        name: 'STREAM',
        value: 0x00000200
    },
    CHANGE_NICKNAME: {
        name: 'CHANGE_NICKNAME',
        value: 0x04000000
    },
    MANAGE_NICKNAMES: {
        name: 'MANAGE_NICKNAMES',
        value: 0x08000000
    },
    MANAGE_ROLES: {
        name: 'MANAGE_ROLES',
        value: 0x10000000
    },
    MANAGE_WEBHOOKS: {
        name: 'MANAGE_WEBHOOKS',
        value: 0x20000000
    },
    MANAGE_EMOJIS: {
        name: 'MANAGE_EMOJIS',
        value: 0x40000000
    }
}

export const REQUIRED = [
    PERMISSIONS.VIEW_CHANNEL,
    PERMISSIONS.SEND_MESSAGES,
    PERMISSIONS.EMBED_LINKS,
    PERMISSIONS.READ_MESSAGE_HISTORY,
    PERMISSIONS.ADD_REACTIONS
]

export default PERMISSIONS