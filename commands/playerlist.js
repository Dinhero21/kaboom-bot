const discord = require('discord.js')

module.exports = {
  discord (handler) {
    const players = handler.bot.players

    const playersEmbed = new discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle('Players')

    for (const [name, player] of Object.entries(players.getPlayersByName())) {
      playersEmbed.addField(name, `\`${player.UUID}\``, true)
    }

    handler.sendEmbed(playersEmbed)
  },
  name: 'playerlist',
  description: 'Shows all players in the server.',
  usage: 'playerlist',
  trust: 0,
  enabled: true
}
