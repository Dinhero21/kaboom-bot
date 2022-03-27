const { set } = require('lodash')

module.exports = {
  execute: Handler => {
    const [path, color] = Handler.args

    set(Handler.colors, path, color)
  },
  name: 'color',
  description: 'Will change the color pallet for the bot.',
  usage: 'color <path> <color>',
  trust: 0,
  enabled: true
}
