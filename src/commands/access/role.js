const common = require('../../common')

const commands = common.commands
const groups = common.groups
const guilds = common.guilds
const colors = common.colors
const send = common.send
const man = common.man

commands.role = {

    name: 'role',

    group: groups.access,

    description: 'role.description',

    usage: 'role [@role] [description]',

    examples: 'role @game1 Gives access to game1 voice and text channels',

    arguments: 2,

    action: (msg, role, description) => {
        const t = guilds[msg.guild.id].t

        if (role) {
            let fields = [
                
            ]
            if (description) {
                fields.push({
                    name: t('role.fieldDescription'),
                    value: description,
                    inline: true
                })
            }

            send({
                channel: msg.channel,
                text: description,
                embed: {
                    color: colors.highlightDefault,
                    fields: [
                        {
                            name: t('role.role'),
                            value: '' + role,
                            inline: true
                        },
                        {
                            name: t('role.addRemoveReaction'),
                            value: t('role.reaction'),
                            inline: true
                        }
                    ]
                }
            })
            .then(result => {
                result.react(t('role.reaction'))
            })
        } else {
            man(msg, 'role')
        }
    },

    update: (msg, author, emoji, isAdd) => {
        if (emoji !== guilds[msg.guild.id].t('role.reaction')) {
            return
        }
        let role = msg.guild.roles.get(msg.embeds[0].fields[0].value.slice(3, -1))
        let member = msg.guild.member(author)
        if (role && member) {
            if (isAdd) {
                member.addRole(role)
            } else {
                member.removeRole(role)
            }
        }
    }

}