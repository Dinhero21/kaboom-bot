const CommandHandler = require('./CommandHandler.js')
const discord = require('discord.js')

class DiscordCommandHandler extends CommandHandler {
  constructor (bot, content, author, channel, args, client) {
    super(bot)

    this.content = content
    this.author = author
    this.channel = channel
    this.args = args

    this.client = client
  }

  error (error) {
    const errorEmbed = new discord.MessageEmbed()

    if (error instanceof Error) {
      errorEmbed
        .setColor('RED')
        .setTitle(error.message)
        .setDescription(error.stack)
        .setFooter(error.code)
    } else if (typeof error === 'string') {
      errorEmbed
        .setColor('RED')
        .setTitle('Error')
        .setDescription(error)
    } else throw new Error('Invalid error type')

    this.sendEmbed(errorEmbed)
  }

  sendEmbed (embed) {
    this.send({ embeds: [embed] })
  }

  send (message) {
    console.log('Sending Message:')
    console.log(message)

    this.channel.send(message)
  }
}

module.exports = DiscordCommandHandler
