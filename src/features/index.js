import settings from './settings'
import fun from './fun'
import management from './management'

export function features() {
    return [
            ...settings,
            ...fun,
            ...management
        ]
        .reduce((features, feature) => {
            features[feature.name] = feature
            return features
        }, {})
}

export default features()

/*
template = {
    // REQUIRED properties

    name: string -> call name of the feature
    group: Object -> group from internal/groups
    description: string -> localized description
    usage: string -> command line with args
    examples: string -> examples of usage
    permissions: [] -> list of required permissions for command and usage
    
    // OPTIONAL properties

    arguments: -> number for long arguments with spaces
    
    // REQUIRED functions

    handle: async (msg, ...args) => {} response command to user request
}
*/