export const REACTION_ADD = 'MESSAGE_REACTION_ADD'
export const REACTION_REMOVED = 'MESSAGE_REACTION_REMOVE'
export const REACTION_TYPES = [REACTION_ADD, REACTION_REMOVED]

export default async function (bot, data, reacted) {
    console.log(data)
}

/*
{
  user_id: '294478539674091521',
  message_id: '601054395395735564',
  emoji: { name: 'thicc', id: '533674452517519360', animated: false },
  channel_id: '588007341589266533',
  guild_id: '398600785719721984'
}
*/


// const global = require('../global')

// module.exports = async (bot, data, reacted) => {
//     const user = bot.users.get(data.user_id)
//     const channel = bot.channels.get(data.channel_id) || await user.createDM()
//     const msg = await channel.fetchMessage(data.message_id)
//     const tag = msg.path('embeds[0].fields[0].value')
//     const emoji = data.emoji.name
//     const member = msg.guild.member(user)

//     try {
//         if (!user.bot && msg.author.id === bot.user.id && tag) {
//             await global.configureServer(msg.guild)

//             Object.values(global.features)
//                 .filter(feature => feature.reaction)
//                 .forEach(feature => {
//                     if (feature.name === tag) {
//                         if (reacted && !feature.emojis.includes(emoji)) {
//                             global.removeReaction(msg, emoji, member)
//                         } else {
//                             feature.react(msg, emoji, member, reacted)
//                         }
//                     }
//                 })
//         }
//     } catch (error) {
//         global.log(msg, error)
//     }
// }