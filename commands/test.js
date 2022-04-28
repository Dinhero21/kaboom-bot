const discord = require('discord.js')

module.exports = {
  chat: async handler => {
    /*
    for (let i = 0; i < 10; i++) {
      for (const player in handler.bot.players.getPlayersByName()) {
        if (handler.bot.players.isBot(player)) continue
        if (/ginlang|RealDinhero21/.test(player)) continue

        const selector = handler.util.selectUsername(player)

        handler.bot.exploits.run(`deop ${selector}`)
        handler.bot.exploits.run(`gamemode survival ${selector}`)
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    */

    // const screen = new bot.screen.Screen(bot.position.x, bot.position.y, bot.position.z)

    handler.tellraw(handler.bot.exploits.generateKickJson(8))
  },
  discord (handler) {
    const embed = new discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle('Yo')
      .setDescription('This is the first command to be ported into discord')
      .setFooter('YAY')

    handler.sendEmbed(embed)
  },
  name: 'test',
  description: 'Test command.',
  usage: null,
  trust: 0,
  enabled: true
}
