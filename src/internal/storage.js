import firebase from 'firebase-admin'
import { TOKEN } from './config'
import { readFileSync, existsSync } from 'fs'

const memoryCache = {}
const db = connectToFirestore()

export default {

    save: async (id, json) => {
        return db
            .doc(`bots/${TOKEN}/servers/${id}`)
            .set(json)
            .then(() => {
                memoryCache[id] = json
            })
    },

    obtain: async (id, def) => {
        return memoryCache[id] || def
    },

    remove: async (id) => {
        delete memoryCache[id]
    }

}

function obtainFirebaseServiceAccount() {
    const firebaseCredentialFile = './firebase-credential.json'
    const firebaseCredentialEnv = 'executor_firebase_credential'

    if (existsSync(firebaseCredentialFile)) {
        return JSON.parse(readFileSync(firebaseCredentialFile))
    } else if (process.env[firebaseCredentialEnv]) {
        return JSON.parse(process.env[firebaseCredentialEnv])
    } else {
        throw 'Firestore credentials not found!'
    }
}

function connectToFirestore() {
    const serviceAccount = obtainFirebaseServiceAccount()
    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount)
    })
    return firebase.firestore()
}