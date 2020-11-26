import colors from '../../internal/colors.js'
import groups from '../../internal/groups.js'
import { error } from '../../utils/response.js'
import { features as getFeaturesList } from '../index.js'

export async function man(context, name) {
    const features = getFeaturesList()

    if (!name) {
        return showFeaturesList(context, features)
    } else if (!features[name]) {
        return error({
            context: context,
            description: context.t('global.unknown_command', { command: name })
        })
    } else {
        const feature = features[name]
        const embed = {
            title: feature.name,
            description: context.t(feature.description),
            color: colors.highlightDefault,
            fields: [
                {
                    name: context.t('man.usage'),
                    value: feature.usage
                },
                {
                    name: context.t('man.examples_list'),
                    value: context.t(`${feature.name}.examples`)
                }
            ]
        }
        if (feature.permissions.length) {
            embed.fields.push({
                name: context.t('man.permissions'),
                value: feature.permissions.map(p => context.t(`permissions.${p}`)).join('\n')
            })
        }
        return context.channel.send('', { embed: embed })
    }
}

export default {
    name: 'man',
    group: groups.settings,
    description: 'man.description',
    usage: 'man [command]',
    examples: 'man.examples',
    arguments: 1,
    permissions: [],

    execute: man
}

async function showFeaturesList(context, features) {
    const embed = {
        title: context.t('man.list'),
        color: colors.highlightDefault,
        fields: []
    }
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
            embed.fields.push(group.field)
        }
        if (group.field.value.length > 0) {
            group.field.value += '\n'
        }
        group.field.value += feature.name
        return group
    }

    Object.values(features)
        .filter(feature => !feature.exclude)
        .sort(sorter)
        .reduce(formatter, {})

    return context.channel.send('', { embed: embed })
}