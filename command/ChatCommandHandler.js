const CommandHandler = require('./CommandHandler.js')

class ChatCommandHandler extends CommandHandler {
  constructor (bot, args, username) {
    super(bot)

    this.args = args
    this.username = username
  }

  tellraw (message, username) {
    username = username ?? this.username

    this.bot.util.tellraw(message, username)
  }

  error (message, username) {
    username = username ?? this.username

    this.bot.util.error(message, username)
  }
}

module.exports = ChatCommandHandler
