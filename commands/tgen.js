const fs = require('fs')
const markov = require('markov')

const generator = markov(1)

class TGen extends Command {
  async run (args, username) {
    let [path, length] = args

    length = parseInt(length) ?? 32

    if (!path || !path.includes('text/')) return this.handler.bot.chat('Invalid path.')

    path = path.startsWith('./') ? path : `./${path}`

    if (!fs.existsSync(path)) return this.handler.bot.chat('Could not find file.')

    const message = fs.readFileSync(path, 'utf8')
    const key = message.split(' ')[0]

    generator.seed(message)

    const result = generator.respond(key, length).join(' ')

    for (const line of result.split('\n')) {
      this.handler.tellraw(line.replaceAll('\r', ''))

      await new Promise(resolve => this.handler.bot.once('tick', resolve))
    }
  }
}

module.exports = {
  Command: TGen,
  name: 'tgen',
  description: 'Generates text using the markov text generation algorithim.',
  usage: 'tgen <path>',
  trust: 0,
  enabled: true
}
