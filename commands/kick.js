module.exports = {
  chat (handler) {
    let [player, method] = handler.args

    method = method ?? process.env.PREFERRED_KICK

    if (handler.bot.host === 'sus.shhnowisnottheti.me') method = 'data'

    handler.bot.exploits.kick(player, method)
  },
  terminal (handler) {
    let [player, method] = handler.args

    method = method ?? process.env.PREFERRED_KICK

    if (handler.bot.host === 'sus.shhnowisnottheti.me') method = 'data'

    handler.bot.exploits.kick(player, method)
  },
  discord (handler) {
    let [player, method] = handler.args

    method = method ?? process.env.PREFERRED_KICK

    if (handler.bot.host === 'sus.shhnowisnottheti.me') method = 'data'

    handler.bot.exploits.kick(player, method)
  },
  name: 'kick',
  description: 'Will kick a player.',
  usage: 'kick <player> [<method>]',
  trust: 0,
  enabled: true
}
