import { error, ERROR_MISSING_PERMISSIONS, log } from '../utils/response.js'

export const PERMISSIONS = {
    CREATE_INSTANT_INVITE: 'CREATE_INSTANT_INVITE',
    KICK_MEMBERS: 'KICK_MEMBERS',
    BAN_MEMBERS: 'BAN_MEMBERS',
    ADMINISTRATOR: 'ADMINISTRATOR',
    MANAGE_CHANNELS: 'MANAGE_CHANNELS',
    MANAGE_GUILD: 'MANAGE_GUILD',
    ADD_REACTIONS: 'ADD_REACTIONS',
    VIEW_AUDIT_LOG: 'VIEW_AUDIT_LOG',
    VIEW_CHANNEL: 'VIEW_CHANNEL',
    SEND_MESSAGES: 'SEND_MESSAGES',
    SEND_TTS_MESSAGES: 'SEND_TTS_MESSAGES',
    MANAGE_MESSAGES: 'MANAGE_MESSAGES',
    EMBED_LINKS: 'EMBED_LINKS',
    ATTACH_FILES: 'ATTACH_FILES',
    READ_MESSAGE_HISTORY: 'READ_MESSAGE_HISTORY',
    MENTION_EVERYONE: 'MENTION_EVERYONE',
    USE_EXTERNAL_EMOJIS: 'USE_EXTERNAL_EMOJIS',
    CONNECT: 'CONNECT',
    SPEAK: 'SPEAK',
    MUTE_MEMBERS: 'MUTE_MEMBERS',
    DEAFEN_MEMBERS: 'DEAFEN_MEMBERS',
    MOVE_MEMBERS: 'MOVE_MEMBERS',
    USE_VAD: 'USE_VAD',
    PRIORITY_SPEAKER: 'PRIORITY_SPEAKER',
    STREAM: 'STREAM',
    CHANGE_NICKNAME: 'CHANGE_NICKNAME',
    MANAGE_NICKNAMES: 'MANAGE_NICKNAMES',
    MANAGE_ROLES: 'MANAGE_ROLES',
    MANAGE_WEBHOOKS: 'MANAGE_WEBHOOKS',
    MANAGE_EMOJIS: 'MANAGE_EMOJIS'
}

export const REQUIRED = [
    PERMISSIONS.VIEW_CHANNEL,
    PERMISSIONS.SEND_MESSAGES,
    PERMISSIONS.EMBED_LINKS,
    PERMISSIONS.READ_MESSAGE_HISTORY,
    PERMISSIONS.ADD_REACTIONS,
    PERMISSIONS.MANAGE_MESSAGES
]

export default PERMISSIONS

export async function verifyBotPermissions(context, request) {
    const bot = context.guild.member(context.client.user)
    const core = _missing(bot, context.channel, REQUIRED)
    if (core.length) {
        await _notify(
                context,
                await context.author.createDM(),
                context.t('permissions.bot_requires_core_permissions', { channel: context.channel.name, server: context.guild.name }),
                core
            ).catch(error => log(context, error))
        throw ERROR_MISSING_PERMISSIONS
    }
    const feature = _missing(bot, context.channel, request.feature.permissions).filter(p => p !== PERMISSIONS.ADMINISTRATOR)
    if (feature.length) {
        await _notify(
                context,
                context.channel,
                context.t('permissions.bot_requires_permissions'),
                feature
            ).catch(error => log(context, error))
        throw ERROR_MISSING_PERMISSIONS
    }
}

export async function verifyUserPermissions(context, request) {
    const missing = _missing(context.member, context.channel, request.feature.permissions)
    if (missing.length) {
        await _notify(
                context,
                await context.author.createDM(),
                context.t('permissions.user_requires_permissions', { channel: context.channel.name, server: context.guild.name }),
                missing
            ).catch(error => { log(context, error) })
        throw ERROR_MISSING_PERMISSIONS
    }
}

function _missing(member, channel, permissions) {
    return channel
        .permissionsFor(member)
        .missing(permissions)
}

async function _notify(context, channel, text, missing) {
    return error({
        context: context,
        channel: channel,
        text: text,
        title: context.t('permissions.missing_permissions'),
        description: missing.map(p => context.t(`permissions.${p}`)).join('\n')
    })
}