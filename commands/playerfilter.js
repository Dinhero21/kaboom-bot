module.exports = {
  execute: Handler => {
    const [method, player] = Handler.args

    if (!player in Handler.bot.players) Handler.error(`Unknown player ${player}.`)

    switch (method) {
      case 'set':
        Handler.bot.ban.filter.set(player)
        break
      case 'clear':
        Handler.bot.ban.filter.clear(player)
        break
      default:
        Handler.error(`Unknown method ${method}`)
        break
    }
  },
  name: 'playerfilter',
  description: 'Will set or clear the playerfilter regex.',
  usage: 'playerfilter <set <regex>|clear>',
  trust: 0,
  enabled: true
}
