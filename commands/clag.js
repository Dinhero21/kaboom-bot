const Vec2 = require('vec2')

module.exports = {
  execute: Handler => {
    const position = new Vec2(Math.random() - 0.5, Math.random() - 0.5)

    position.normalize().multiply(100000)

    Handler.bot.core.run('de')
    Handler.bot.core.run('forceload remove all')
    Handler.bot.core.run(`setworldspawn ${position.x} 256 ${position.y}`)
    Handler.bot.core.run('sudo ** spawn')
  },
  name: 'clag',
  description: 'Clears lag.',
  usage: 'clag',
  trust: 0,
  enabled: true
}
