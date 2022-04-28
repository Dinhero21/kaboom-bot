module.exports = {
  chat (handler) {
    const username = handler.args.join(' ')

    const player = handler.bot.players.getPlayer(username)

    if (!player) {
      handler.error('Player not found.')
      return
    }

    Object.entries(player).forEach(([key, value]) => {
      handler.tellraw([
        {
          text: key,
          color: '#FF5154',
          clickEvent: {
            action: 'copy_to_clipboard',
            value: key
          }
        },
        {
          text: ': ',
          color: '#373F47'
        },
        {
          text: value,
          color: '#758BFD',
          clickEvent: {
            action: 'copy_to_clipboard',
            value: value
          }
        }
      ])
    })
  },
  name: 'playerinfo',
  description: 'Get info about a player.',
  usage: 'playerinfo <uuid>',
  trust: 0,
  enabled: true
}
