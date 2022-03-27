const fs = require('fs')
const sharp = require('sharp')

class MapArt extends Command {
  async run (args, username) {
    let [path, w, h, x, y] = args

    if (!path || !path.includes('images/')) return this.handler.error(this.handler.errors.INVALID_PATH)

    path = path.startsWith('./') ? path : `./${path}`

    console.log(path)

    if (!fs.existsSync(path)) return this.handler.error(this.handler.errors.MISSING_FILE)
    if (!['jpg', 'png'].some(extension => path.split('\\').at(-1).split('.').at(-1) === extension)) return this.handler.error(this.handler.errors.INVALID_FORMAT) // TODO: Make this use path library

    if (w > 256 || h > 256 || w * h > 256 * 256) return this.handler.error('Image too big! Maximum area: 65536, Maximum Size: 256')
    if (w < 16 || h < 16) return this.handler.error('Minimum size: 16.')

    const image = sharp(path)

    x ??= Math.floor(this.handler.bot.position.x)
    y ??= Math.floor(this.handler.bot.position.z)

    w = parseInt(w)
    h = parseInt(h)

    w = Number.isNaN(w) ? image.width : w
    h = Number.isNaN(h) ? image.height : h

    this.handler.bot.draw(await image.resize(w, h).raw().toBuffer(), x, y, w, h, this.handler.config.floorChunkSize)
  }
}

module.exports = {
  Command: MapArt,
  name: 'mapart',
  description: 'Creates an mapart with the provided image, witdh, height, x and y. If width or height are not provided, the original image width and height will be used. If x and y are not provided the x and y of the bot will be used.',
  usage: 'mapart <path> [<width>? <height>?] [<x>? <y>?]',
  trust: 0,
  enabled: true
}
