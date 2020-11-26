import firebase from 'firebase-admin'
import { existsSync, readFileSync } from 'fs'

const _firebaseCredentialsFile = './firebase-credentials.json'
const _firebaseCredentialsEnv = 'leeroy_firebase_credentials'

const _cache = {}
const _database = connect()

export default {
    save: async (context, collection, object) => {
        if (_database) {
            return _database
                .collection(collection)
                .doc(key(context))
                .set(object)
                .then(() => { _cache[cacheKey(context, collection)] = object })
        } else {
            _cache[cacheKey(context, collection)] = object
        }
    },
    obtain: async (context, collection, def) => {
        let data = _cache[cacheKey(context, collection)]
        if (data) return data

        if (_database) {
            data = (await _database
                .collection(collection)
                .doc(key(context))
                .get())
                .data()
        }
        if (!data) data = def
        _cache[cacheKey(context, collection)] = data

        return data
    }
}

function key(context) { return `${context.client.user.id}#${context.guild.id}` }

function cacheKey(context, collection) { return `${collection}|${key(context)}` }

function connect() {
    try {
        let serviceAccount
        if (existsSync(_firebaseCredentialsFile)) {
            serviceAccont = readFileSync(_firebaseCredentialsFile)
        } else {
            serviceAccount = process.env[_firebaseCredentialsEnv]
        }
        if (serviceAccount) {
            serviceAccount = JSON.parse(serviceAccount)
            firebase.initializeApp({ credential: firebase.credential.cert(serviceAccount) })
        }
    } catch (error) {
        return null
    }
}