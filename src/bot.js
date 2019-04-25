const discord = require('discord.js')
const common = require('./common')
const events = require('./events')
require('./commands')

const bot = new discord.Client()
bot.on('message', events.message)
bot.login(common.config.token)