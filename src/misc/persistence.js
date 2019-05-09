const storage = require('node-persist')

module.exports = {

    save: async (id, object) => storage.updateItem(id, object),

    obtain: async (id, defValue) => storage.getItem(id).then(result => result ? result : defValue)

}