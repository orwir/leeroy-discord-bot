import groups from '../../internal/groups.js'
import { error, message } from '../../utils/response.js'
import { features as getFeaturesList } from '../index.js'

export async function man(context, command) {
    const features = getFeaturesList()

    if (!command) {
        return _messageFeatures(context, features)
    } else if (!features[command]) {
        return error({
            context: context,
            description: context.t('global.unknown_command', { command: command }),
            command: 'man',
            member: context.member
        })
    } else {
        const feature = features[command]
        const fields = [
            {
                name: context.t('man.usage'),
                value: feature.usage
            },
            {
                name: context.t('man.examples_list'),
                value: context.t(`${feature.name}.examples`)
            }
        ]
        if (feature.permissions?.length) {
            fields.push({
                name: context.t('man.permissions'),
                value: feature.permissions.map(p => context.t(`permissions.${p}`)).join('\n')
            })
        }
        return message({
            channel: context.channel,
            title: `__${feature.name}__`,
            description: context.t(feature.description),
            member: context.member,
            fields: fields
        })
    }
}

export default {
    name: 'man',
    group: groups.settings,
    description: 'man.description',
    usage: 'man [<command>]',
    examples: 'man.examples',
    arguments: 1,
    permissions: [],

    execute: man
}

async function _messageFeatures(context, features) {
    const fields = []
    const sorter = (a, b) => {
        if (a.group.order === b.group.order) {
            return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0
        } else {
            return a.group.order - b.group.order
        }
    }
    const formatter = (group, feature) => {
        if (group.name !== feature.group.name) {
            group = {
                name: feature.group.name,
                field: {
                    name: `${feature.group.icon} ${context.t(feature.group.name)}`,
                    inline: true,
                    value: ''
                }
            }
            fields.push(group.field)
        }
        if (group.field.value.length > 0) {
            group.field.value += '\n'
        }
        group.field.value += feature.name
        return group
    }

    Object.values(features)
        .filter(feature => feature.group !== groups.system)
        .sort(sorter)
        .reduce(formatter, {})

    return message({
        channel: context.channel,
        title: context.t('man.list'),
        fields: fields,
        command: 'man',
        member: context.member
    })
}
