module.exports = {
  execute: Handler => {
    const player = Handler.args.join(' ')

    const players = Handler.bot.players.list.uuid

    if (player in players) {
      const properties = players[player]

      Object.keys(properties).forEach(propertie => {
        if (properties[propertie]) {
          Handler.tellraw([
            {
              text: propertie,
              color: '#FF5154',
              clickEvent: {
                action: 'copy_to_clipboard',
                value: propertie
              }
            },
            {
              text: ': ',
              color: '#373F47'
            },
            {
              text: properties[propertie],
              color: '#758BFD',
              clickEvent: {
                action: 'copy_to_clipboard',
                value: properties[propertie]
              }
            }
          ])
        }
      })
    } else Handler.error('Player not found.')
  },
  name: 'playerinfo',
  description: 'Get info about a player.',
  usage: 'playerinfo <uuid>',
  trust: 0,
  enabled: true
}
