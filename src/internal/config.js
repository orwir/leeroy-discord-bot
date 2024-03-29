import { existsSync, readFileSync } from 'fs'
import * as language from '../features/settings/language.js'
import * as server from '../features/system/server.js'

export const devConfig = (() => {
    const config = './dev-config.json'
    if (existsSync(config)) return JSON.parse(readFileSync(config))
    return {}
})()

export const TOKEN = devConfig.token || process.env.leeroy_auth_token

export const PREFIX = devConfig.prefix|| '$'

export const VERSION = readFileSync('./VERSION', 'utf8')

export const LANGUAGES = {
    en: { translation: JSON.parse(readFileSync('./res/locales/en.json')) },
    ru: { translation: JSON.parse(readFileSync('./res/locales/ru.json')) }
}

export const Server = {

    config: async (guild) => server.obtain(guild),

    language: async (guild) => {
        const config = await server.obtain(guild)
        return language.obtain(config.language)
    },

    save: async (guild, config) => server.save(guild, config)

}
