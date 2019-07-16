import { readFileSync } from 'fs'

export const token = process.env.executor_auth_token
export const prefix = process.env.executor_prefix || 'e!'
export const languages = {
    en: { translation: JSON.parse(readFileSync('./res/locales/en.json')) },
    ru: { translation: JSON.parse(readFileSync('./res/locales/ru.json')) }
}
export const version = readFileSync('./VERSION', 'utf8')