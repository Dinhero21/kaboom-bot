const { hsl } = require('color-convert')

module.exports = {
  chat (handler) {
    const text = handler.args.join(' ')

    handler.tellraw(text.split('').map((character, index) => {
      return {
        text: character,
        color: `#${hsl.hex(index / text.length * 360, 100, 50)}`
      }
    }))
  },
  name: 'rainbowify',
  description: 'Rainbowifies an text.',
  usage: 'rainbowify <text>',
  trust: 0,
  enabled: true
}
