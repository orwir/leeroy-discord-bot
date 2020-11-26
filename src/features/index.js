import fun from './fun/index.js'
import management from './management/index.js'
import settings from './settings/index.js'
import system from './system/index.js'

export function features() {
    return [
            ...settings,
            ...fun,
            ...management,
            ...system
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

    arguments: number -> number for long arguments with spaces
    exclude: boolean -> if feature should be excluded from the list of features
    
    
    // handlers

    execute: async (context, ...args) => {} response command to user request

    onMessage: async (message) => {}

    onReaction: async (context, user, reacted) => {}
}
*/