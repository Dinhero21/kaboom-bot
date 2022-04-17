const CommandHandler = require('./CommandHandler.js')

class ChatCommandHandler extends CommandHandler {
  constructor (bot, args) {
    super(bot)

    this.args = args
    this.logger = bot.logger
  }

  log (message) {
    console.info(message)

    this.logger.info(message)
  }

  error (message) {
    console.error(message)

    this.logger.error(message)
  }
}

module.exports = ChatCommandHandler
