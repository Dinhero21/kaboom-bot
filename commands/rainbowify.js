const { hsl } = require('color-convert')

class Rainbowify extends Command {
  run (args, username) {
    const text = args.join(' ')

    this.handler.tellraw(text.split('').map((character, index) => {
      return {
        text: character,
        color: `#${hsl.hex(index / text.length * 360, 100, 50)}`
      }
    }))
  }
}

module.exports = {
  Command: Rainbowify,
  name: 'rainbowify',
  description: 'Rainbowifies an text.',
  usage: 'rainbowify <text>',
  trust: 0,
  enabled: true
}
