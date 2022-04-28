const Vec2 = require('vec2')

module.exports = {
  chat (handler) {
    let distance = handler.args.join(' ')

    distance = distance ? parseInt(distance) : 1000

    const pos = new Vec2(Math.random() - 0.5, Math.random() - 0.5).normalize().multiply(distance)

    handler.core.run(`tp ${handler.util.selectUsername(handler.username)} ${pos.x} 256 ${pos.y}`)
  },
  name: 'rtp',
  description: 'Teleports a player randomly with the distance provided, if not provided will use 1000',
  usage: 'rtp [<distance>]',
  trust: 0,
  enabled: true
}
