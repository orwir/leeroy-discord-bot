import { readFileSync } from 'fs'
import { obtain as server, save as saveServer } from '../features/settings/server'
import { obtain as language } from '../features/settings/language'

export const TOKEN = process.env.executor_auth_token
export const PREFIX = process.env.executor_prefix || 'e!'
export const LANGUAGES = {
    en: { translation: JSON.parse(readFileSync('./res/locales/en.json')) },
    ru: { translation: JSON.parse(readFileSync('./res/locales/ru.json')) }
}
export const VERSION = readFileSync('./VERSION', 'utf8')

export const Server = {

    config: async (guild) => await server(guild),

    language: async (guild) => {
        const config = await server(guild)
        return await language(config.language)
    },

    prefix: async (guild) => {
        const config = await server(guild)
        return config.prefix
    },

    save: async (guild) => await saveServer(guild)

}