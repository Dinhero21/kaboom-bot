const { readFileSync, existsSync } = require('fs')
const sharp = require('sharp')

module.exports = {
  execute: async Handler => {
    let [path, w, h, x, y] = Handler.args

    const { bot } = Handler

    if (!path || !path.includes('images/')) return Handler.error('Invalid path.')

    path = path.startsWith('./') ? path : `./${path}`

    console.log(path)

    if (!existsSync(path)) return Handler.error('Could not find file.')
    if (!['jpg', 'png'].some(extension => path.split('\\').at(-1).split('.').at(-1) === extension)) return Handler.error('Invalid format.')

    if (w > 256 || h > 256 || w * h > 256 * 256) return Handler.error('Image too big!')
    if (w < 16 || h < 16) return Handler.error('Minimum size: 16.')

    const image = sharp(path)

    x ??= Math.floor(bot.position.x)
    y ??= Math.floor(bot.position.z)

    w = parseInt(w)
    h = parseInt(h)

    w = Number.isNaN(w) ? image.width : w
    h = Number.isNaN(h) ? image.height : h

    bot.draw(await image.resize(w, h).raw().toBuffer(), x, y, w, h, Handler.config.floorChunkSize)
  },
  name: 'mapart',
  description: 'Creates an mapart with the provided image, witdh, height, x and y. If width or height are not provided, the original image width and height will be used. If x and y are not provided the x and y of the bot will be used.',
  usage: 'mapart <path> [<width>? <height>?] [<x>? <y>?]',
  trust: 0,
  enabled: true
}
