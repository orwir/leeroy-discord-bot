import groups from "../../internal/groups"

export default {
    name: 'help',
    group: groups.settings,
    description: 'help.description',
    usage: 'help',
    examples: 'help',
    permissions: [],

    handle: async (msg) => {
        // TODO: show help information
    }
}