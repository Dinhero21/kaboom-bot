class Skin extends Command {
  run (args, username) {
    let [skin, player] = args

    skin = skin ?? username
    player = player ?? username

    this.handler.core.run(`sudo ${player} skin ${skin}`)
  }
}

module.exports = {
  Command: Skin,
  name: 'skin',
  description: 'Sets the skin of the player provided to the skin provided, if the player is not provided the player will be yourself, if the skin is not provided your skin will be used',
  usage: 'skin [<skin>?] [<player>?]',
  trust: 0,
  enabled: true
}
