import { PREFIX } from '../../internal/config.js'
import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import storage from '../../internal/storage.js'
import event from '../../internal/event.js'
import { register } from '../../internal/register.js'

const _serverCollection = 'server'

register('server', event.periodic, { schedule: '* */30 * * * *' })

export default {
    name: 'server',
    group: groups.system,
    description: 'gobal.na',
    usage: 'n/a',
    examples: 'global.na',
    permissions: [P.ADMINISTRATOR],

    [event.periodic]: async (bot) => storage.flush(bot)
}

export async function obtain(guild) {
    const config = await storage.obtain(guild.client, _serverCollection, guild, {})

    config.bot_id = config.bot_id || guild.client.user.id
    config.bot_name = config.bot_name || guild.client.user.tag
    config.id = config.id || guild.id
    config.name = config.name || guild.name
    config.language = config.language || 'en'
    config.prefix = config.prefix || PREFIX

    return config
}

export async function save(guild, config) {
    return storage.save(guild.client, _serverCollection, guild, config)
}
