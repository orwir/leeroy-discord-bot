const global = require('../global.js')

global.commands.wtf = {

    name: 'wtf',

    group: global.groups.utility,

    description: 'Shows information about bot',

    usage: 'wtf',

    examples: 'wtf',

    stable: true,

    action: (msg) => {
        const guild = msg.guild

        msg.channel.send('', {
            embed: {
                title: 'Greetings mortals!',
                description: `I'm The Executor and I'm here to rule!`,
                color: global.colors.highlightDefault,
                fields: [
                    {
                        name: 'Server',
                        value: guild.name
                    },
                    {
                        name: 'Prefix',
                        value: global.config[guild.id].prefix
                    },
                    {
                        name: 'Commands overview',
                        value: global.commands.man.name
                    }
                ]
            }
        })
    }

}