import firebase from 'firebase-admin'
import { existsSync, readFileSync } from 'fs'
import { log } from '../utils/response.js'

const _firebaseCredentialsFile = './firebase-credentials.json'
const _firebaseCredentialsEnv = 'leeroy_firebase_credentials'

const _cache = {}
const _database = connect()

export default {
    save: async (bot, collection, guild, object) => {
        _cache[cacheKey(bot, guild, collection)] = {
            collection: collection,
            guild: guild ? { id: guild.id } : null,
            data: object,
            flush: true
        }
    },
    obtain: async (bot, collection, guild, def) => {
        let cached = _cache[cacheKey(bot, guild, collection)]
        if (cached) return cached.data

        let data = await obtainFromDB(bot, collection, guild)
        if (!data) data = def
        _cache[cacheKey(bot, guild, collection)] = {
            collection: collection,
            guild: guild ? { id: guild.id } : null,
            data: data,
            flush: false
        }
        return data
    },
    flush: async (bot) => {
        if (!_database) return

        for (const [_, cached] of Object.entries(_cache)) {
            if (cached.flush) {
                try {
                    await saveToDB(bot, cached.collection, cached.guild, cached.data)
                    cached.flush = false
                } catch (error) {
                    log(bot, error)
                }
            }
        }
    }
}

function key(bot, guild) {
    const suffix = guild ? guild.id : 'all'
    return `${bot.user.id}#${suffix}`
}

function cacheKey(bot, guild, collection) { return `${collection}|${key(bot, guild)}` }

function connect() {
    try {
        let serviceAccount
        if (existsSync(_firebaseCredentialsFile)) {
            serviceAccount = readFileSync(_firebaseCredentialsFile)
        } else {
            serviceAccount = process.env[_firebaseCredentialsEnv]
        }
        if (serviceAccount) {
            serviceAccount = JSON.parse(serviceAccount)
            firebase.initializeApp({ credential: firebase.credential.cert(serviceAccount) })
            console.log('Database connection established.')
            return firebase.firestore()
        }
    } catch (error) {
        console.log(`Database connection failure:\n${error}`)
        return null
    }
}

async function saveToDB(bot, collection, guild, object) {
    if (_database) {
        return await _database
            .collection(collection)
            .doc(key(bot, guild))
            .set(object)
    }
    return null
}

async function obtainFromDB(bot, collection, guild) {
    if (_database) {
        if (guild) {
            return (await _database
                .collection(collection)
                .doc(key(bot, guild))
                .get())
                .data()
        } else {
            return (await _database
                .collection(collection)
                .where('bot_id', '==', bot.user.id)
                .get())
                .docs
                .map(doc => doc.data())
        }
    }
    return null
}
