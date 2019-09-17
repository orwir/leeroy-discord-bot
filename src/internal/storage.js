import firebase from 'firebase-admin'
import { readFileSync, existsSync } from 'fs'

const cache = {}
const db = connectToFirestore()

export default {

    save: async (context, collection, object) => {
        return db
            .collection(collection)
            .doc(key(context))
            .set(object)
            .then(() => {
                cache[cacheKey(context, collection)] = object
            })
    },

    obtain: async (context, collection, def) => {
        let data = cache[cacheKey(context, collection)]
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
    const serviceAccount = obtainFirebaseServiceAccount()
    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount)
    })
    return firebase.firestore()
}