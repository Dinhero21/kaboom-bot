module.exports = {
  execute: Handler => {
    const { players } = Handler.bot

    for (const name in players.list.name) {
      const player = players.list.name[name]

      Handler.tellraw({
        text: name,
        color: 'red',
        clickEvent: {
          action: 'run_command',
          value: `${Handler.config.prefix}playerinfo ${player.UUID}`
        },
        hoverEvent: {
          action: 'show_text',
          contents: [
            {
              text: `Click to see more info about ${name}.`,
              color: Handler.colors.open
            }
          ]
        }
      })
    }
  },
  name: 'playerlist',
  description: 'Shows all players in the server.',
  usage: 'playerlist',
  trust: 0,
  enabled: true
}
