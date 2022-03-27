module.exports = {
  execute: Handler => {
    let [mode, player] = Handler.args

    if (player) {
      player = bot.util.parseUsername(player)

      switch (mode) {
        case 'add':
          Handler.bot.whitelist.players.add(player)
          break
        case 'remove':
          Handler.bot.whitelist.players.remove(player)
          break
        default:
          Handler.error('Unknown mode for inputs!')
          break
      }
    } else {
      switch (mode) {
        case 'on':
          Handler.bot.whitelist.whitelisted = true
          break
        case 'off':
          Handler.bot.whitelist.whitelisted = false
          break
        case 'list':
          Handler.bot.whitelist.players.usernames.forEach(username => {
            const player = Handler.util.getPlayer(username)

            if (!player) player.name = username

            Handler.tellraw(player.name) // TODO: Make this preety
          })
          break
        default:
          console.log(mode)

          Handler.error('Unknown mode for inputs!')
          break
      }
    }
  },
  name: 'wl',
  description: 'Whitelist.',
  usage: 'wl <on|off|list|add <player>|remove <player>>',
  trust: 0,
  enabled: true
}
