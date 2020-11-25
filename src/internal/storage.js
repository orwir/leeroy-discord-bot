import { log } from 'console'
import firebase from 'firebase-admin'
import { existsSync, readFileSync } from 'fs'

const cache = {}
const db = connectToFirestore()

export default {

    save: async (context, collection, object) => {
        if (!db) {
            cache[cacheKey(context, collection)] = object
            log(context, 'database is not initialized!')
            return
        }
        return db
            .collection(collection)
            .doc(key(context))
            .set(object)
            .then(() => { cache[cacheKey(context, collection)] = object })
    },

    obtain: async (context, collection, def) => {
        let data = cache[cacheKey(context, collection)]
        if (!db) {
            log(context, 'database is not initialized!')
            return data
        }
        if (!data) {
            const doc = await db
                .collection(collection)
                .doc(key(context))
                .get()
            data = doc.data()
        }
        if (!data) {
            data = def
        }
        cache[cacheKey(context, collection)] = data
        return data
    }

}

function key(context) {
    return `${context.client.user.id}#${context.guild.id}`
}

function cacheKey(context, collection) {
    return `${collection}|${key(context)}`
}

function obtainFirebaseServiceAccount() {
    const firebaseCredentialsFile = './firebase-credentials.json'
    const firebaseCredentialsEnv = 'leeroy_firebase_credentials'

    if (existsSync(firebaseCredentialsFile)) {
        return JSON.parse(readFileSync(firebaseCredentialsFile))

    } else if (process.env[firebaseCredentialsEnv]) {
        return JSON.parse(process.env[firebaseCredentialsEnv])
        
    } else {
        throw 'Firestore credential not found!'
    }
}

function connectToFirestore() {
    try {
        const serviceAccount = obtainFirebaseServiceAccount()
        firebase.initializeApp({ credential: firebase.credential.cert(serviceAccount) })
        return firebase.firestore()
    } catch (error) {
        return null
    }
}