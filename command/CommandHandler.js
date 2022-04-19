const config = require('../config.json')

class CommandHandler {
  constructor (bot) {
    this.bot = bot
    this.config = config
    this.core = this.bot.core
    this.util = this.bot.util
  }
}

module.exports = CommandHandler
