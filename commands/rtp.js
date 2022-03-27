/* eslint no-floating-decimal: "off" */
/* global Command */

const Vec2 = require('vec2')

module.exports = {
  execute: Handler => {
    let distance = Handler.args.join(' ')

    distance = distance ? parseInt(distance) : 1000

    const pos = new Vec2(Math.random() - .5, Math.random() - .5).normalize().multiply(distance)

    Handler.bot.core.run(`/tp ${Handler.username} ${pos.x} 256 ${pos.y}`)
  },
  name: 'rtp',
  description: 'Teleports a player randomly with the distance provided, if not provided will use 1000',
  usage: 'rtp [<distance>?]',
  trust: 0,
  enabled: true
}

class Rtp extends Command {
  run (args, username) {
    let distance = args.join(' ')

    distance = distance ? parseInt(distance) : 1000

    const pos = new Vec2(Math.random() - .5, Math.random() - .5).normalize().multiply(distance)

    this.handler.bot.core.run(`tp ${this.handler.util.selectUsername(username)} ${pos.x} 256 ${pos.y}`)
  }
}

module.exports = {
  Command: Rtp,
  name: 'rtp',
  description: 'Teleports a player randomly with the distance provided, if not provided will use 1000',
  usage: 'rtp [<distance>?]',
  trust: 0,
  enabled: true
}
