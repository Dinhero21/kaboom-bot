class Ban extends Command {
  run (args, username) {
    super.run(args, username)

    const [method, player] = args

    if (!this.handler.bot.util.getPlayer(player)) this.handler.error(`Unknown player ${player}.`)

    switch (method) {
      case 'add':
        console.log(`Banning player ${player}`)

        this.handler.bot.ban.players.add(player)
        break
      case 'remove':
        this.handler.bot.ban.players.remove(player)
        break
      default:
        this.handler.error(`Unknown method ${method}`)
        break
    }
  }
}

module.exports = {
  Command: Ban,
  name: 'ban',
  description: 'Bans or unbans players',
  usage: 'ban <add|remove> <player>',
  trust: 0,
  enabled: true
}
