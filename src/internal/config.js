import { readFileSync } from 'fs'
import * as server from '../features/settings/server'
import { obtain as language } from '../features/settings/language'

export const TOKEN = process.env.leeroy_auth_token

export const PREFIX = process.env.leeroy_prefix || 'e!'

export const LANGUAGES = {
    en: { translation: JSON.parse(readFileSync('./res/locales/en.json')) },
    ru: { translation: JSON.parse(readFileSync('./res/locales/ru.json')) }
}

export const VERSION = readFileSync('./VERSION', 'utf8')

export const Server = {

    config: async (context) => server.obtain(context),

    language: async (context) => {
        const config = await server.obtain(context)
        return language(config.language)
    },

    save: async (context, config) => server.save(context, config)

}