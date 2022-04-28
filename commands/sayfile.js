const fs = require('fs')

module.exports = {
  async chat (handler) {
    let filepath = handler.args.join(' ')

    filepath = `./text/${filepath}`

    if (fs.existsSync(filepath)) {
      for (const line of fs.readFileSync(filepath, 'utf8').split('\n')) handler.tellraw(line.replaceAll('\r', ''), '@a')
    } else {
      handler.error(`Could not find file ${filepath}!`)
    }
  },
  name: 'sayfile',
  description: 'Says every line of a file.',
  usage: 'sayfile <filepath>',
  trust: 0,
  enabled: true
}
