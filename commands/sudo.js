module.exports = {
  chat (handler) {
    const args = handler.args
    const player = args.shift()
    const command = args.join(' ')

    handler.bot.exploits.sudo(player, command)
  },
  discord (handler) {
    const args = handler.args
    const player = args.shift()
    const command = args.join(' ')

    handler.bot.exploits.sudo(player, command)
  },
  name: 'sudo',
  description: 'Sudo with bypass.',
  usage: 'sudo <player> <command>',
  trust: 0,
  enabled: true
}
