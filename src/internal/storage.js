const storage = {}

export async function save(id, object) {
    storage[id] = object
}

export async function obtain(id, def) {
    return storage[id] || def
}

export async function remove(id) {
    delete storage[id]
}