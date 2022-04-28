const config = require('../config.json')
const CommandHandler = require('./CommandHandler.js')
const discord = require('discord.js')

function getTrust (roles) {
  let trust = 0

  for (const [id] of roles) {
    const roleTrust = config.trust[id]

    if (!roleTrust) continue

    if (roleTrust > trust) trust = roleTrust
  }

  return trust
}

class DiscordCommandHandler extends CommandHandler {
  constructor (bot, message, args, client) {
    super(bot)

    this.content = message.content
    this.author = message.author
    this.channel = message.channel
    this.guild = message.guild
    this.args = args

    this.trust = getTrust(message.member.roles.cache)

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
    this.channel.send(message)
  }
}

module.exports = DiscordCommandHandler
