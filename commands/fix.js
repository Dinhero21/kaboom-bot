const Vec2 = require('vec2')

module.exports = {
  chat (handler) {
    const position = new Vec2(Math.random() - 0.5, Math.random() - 0.5)

    position.normalize().multiply(100000)

    handler.tellraw('Unblocking destroy...', '@a')
    handler.bot.exploits.blockde(false)

    handler.tellraw('Disabling all forceloaded chunks...', '@a')
    handler.core.run('forceload remove all')

    handler.tellraw('Recreating spawn...', '@a')

    handler.tellraw(`New spawn at ${position.x} ${position.y}`)
    handler.core.run(`setworldspawn ${position.x} 256 ${position.y}`)

    handler.tellraw('Moving everyone to spawn...', '@a')
    handler.core.run('sudo ** spawn')

    handler.tellraw('Setting gamerules...', '@a')
    handler.core.run('gamerule commandBlockOutput false')
    handler.core.run('gamerule logAdminCommands false')
    handler.core.run('gamerule doMobSpawning false')

    handler.tellraw('Creating a better enviroment for humans...', '@a')
    handler.core.run('weather clear')
    handler.core.run('time set 6000')
  },
  name: 'fix',
  description: 'Fixes all the lag and bad stuff.',
  usage: 'fix',
  trust: 0,
  enabled: true
}
