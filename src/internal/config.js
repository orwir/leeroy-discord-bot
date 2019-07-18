import { readFileSync } from 'fs'

export const TOKEN = process.env.executor_auth_token
export const PREFIX = process.env.executor_prefix || 'e!'
export const LANGUAGES = {
    en: { translation: JSON.parse(readFileSync('./res/locales/en.json')) },
    ru: { translation: JSON.parse(readFileSync('./res/locales/ru.json')) }
}
export const VERSION = readFileSync('./VERSION', 'utf8')

export const Server = {

    language: async (guild) => {
        
    },

    prefix: async (guild) => {
        return PREFIX
    }

}