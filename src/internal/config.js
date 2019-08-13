import { readFileSync } from 'fs'
import server from '../features/settings/server'
import { obtain as language } from '../features/settings/language'

export const TOKEN = process.env.executor_auth_token
export const PREFIX = process.env.executor_prefix || 'e!'
export const LANGUAGES = {
    en: { translation: JSON.parse(readFileSync('./res/locales/en.json')) },
    ru: { translation: JSON.parse(readFileSync('./res/locales/ru.json')) }
}
export const VERSION = readFileSync('./VERSION', 'utf8')

export const Server = {

    config: async (guild) => await server.obtain(guild),

    language: async (guild) => {
        const config = await server.obtain(guild)
        return await language(config.language)
    },

    prefix: async (guild) => {
        const config = await server.obtain(guild)
        return config.prefix
    },

    save: async (guild) => await server.save(guild)

}