const { hsl } = require('color-convert')

module.exports = {
  execute: Handler => {
    const text = Handler.args.join(' ')

    Handler.tellraw([...text].map((character, index) => {
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
