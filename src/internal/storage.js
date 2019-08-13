const storage = {}

export default {
    
    save: async (id, object) => {
        storage[id] = object
    },

    obtain: async (id, def) => {
        return storage[id] || def
    },

    remove: async (id) => {
        delete storage[id]
    }

}