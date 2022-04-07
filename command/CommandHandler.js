const config = require('../config.json')

class CommandHandler {
  constructor (bot) {
    this.bot = bot
    this.config = config
  }
}

module.exports = CommandHandler
