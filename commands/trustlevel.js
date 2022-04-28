const discord = require('discord.js')

module.exports = {
  discord (handler) {
    const embed = new discord.MessageEmbed()
      .setTitle('Trust')
      .setDescription(`Your trust level is ${handler.trust}.`)

    handler.sendEmbed(embed)
  },
  name: 'trusted',
  description: 'Gets your trust level.',
  usage: 'trusted',
  trust: 0,
  enabled: true
}
