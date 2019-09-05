import groups from '../../internal/groups'
import colors from '../../internal/colors'
import { Server } from '../../internal/config'
import { features as getFeaturesList } from '../index'

async function showFeaturesList(msg, features, t) {
    const embed = {
        title: t('man.list'),
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
                    name: `${feature.group.icon} ${t(feature.group.name)}`,
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
        .sort(sorter)
        .reduce(formatter, {})

    return await msg.channel.send('', { embed: embed })
}

export default {
    name: 'man',
    group: groups.settings,
    description: 'man.description',
    usage: 'man [command]',
    examples: 'man help\nman',

    handle: async (msg, name) => {
        const features = getFeaturesList()
        const t = await Server.language(msg.guild)

        if (!name) {
            return await showFeaturesList(msg, features, t)

        } else if (!features[name]) {
            return await msg.channel.send('', {
                embed: {
                    title: t('global.error'),
                    description: t('global.unknown_command', { command: name }),
                    color: colors.highlightError
                }
            })

        } else {
            const feature = features[name]
            return await msg.channel.send('', {
                embed: {
                    title: feature.name,
                    description: t(feature.description),
                    color: colors.highlightDefault,
                    fields: [
                        {
                            name: t('man.usage'),
                            value: feature.usage,
                            inline: true
                        },
                        {
                            name: t('man.examples'),
                            value: feature.examples,
                            inline: true
                        }
                    ]
                }
            })
        }

    }
}