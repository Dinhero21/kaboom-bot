class Ban extends Command {
  run (args, username) {
    const [method, player] = args
    
    if(handler.bot.util.getPlayer)
  }
}

module.exports = {
  execute: Handler => {
    const [method, player] = Handler.args

    // TODO: Make this better :)

    if (!player in Handler.bot.players.list.both) Handler.error(`Unknown player ${player}.`)

    switch (method) {
      case 'add':
        console.log(`Banning player ${player}`)

        Handler.bot.ban.players.add(player)
        break
      case 'remove':
        Handler.bot.ban.players.remove(player)
        break
      default:
        Handler.error(`Unknown method ${method}`)
        break
    }
  },
  name: 'ban',
  description: 'Bans or unbans players',
  usage: 'ban <add|remove> <player>',
  trust: 0,
  enabled: true
}
