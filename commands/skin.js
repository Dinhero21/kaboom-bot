module.exports = {
  execute: Handler => {
    let [skin, player] = Handler.args

    skin = skin ?? Handler.username
    player = player ?? Handler.username

    Handler.bot.core.run(`sudo ${player} skin ${skin}`)
  },
  name: 'skin',
  description: 'Sets the skin of the player provided to the skin provided, if the player is not provided the player will be yourself, if the skin is not provided your skin will be used',
  usage: 'skin [<skin>?] [<player>?]',
  trust: 0,
  enabled: true
}
