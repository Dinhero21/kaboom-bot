module.exports = {
  chat (handler) {
    const [type, regex] = handler.args

    switch (type) {
      case 'chat':
        handler.bot.filter.chat.regex = new RegExp(regex)
        break
      case 'player':
        handler.bot.filter.player.regex = new RegExp(regex)
        break
      case 'cspy':
        handler.bot.filter.cspy.regex = new RegExp(regex)
        break
      default:
        handler.error(`Unknown type ${type}! The types are: chat, player, cspy.`)
    }
  },
  name: 'filter',
  description: 'Kick filter.',
  usage: 'filter <type> <regex>',
  trust: 0,
  enabled: true
}
