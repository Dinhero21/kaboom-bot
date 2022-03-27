const { readFileSync, existsSync } = require('fs')
const markov = require('markov')

const generator = markov(1)

module.exports = {
  execute: async Handler => {
    let [path, length] = Handler.args

    length = parseInt(length) ?? 32

    if (!path || !path.includes('text/')) return Handler.bot.chat('Invalid path.')

    path = path.startsWith('./') ? path : `./${path}`

    if (!existsSync(path)) return Handler.bot.chat('Could not find file.')

    const message = readFileSync(path, 'utf8')
    const key = message.split(' ')[0]

    generator.seed(message)

    const result = generator.respond(key, 32).join(' ')

    for (const line of result.split('\n')) {
      Handler.tellraw(line.replaceAll('\r', ''))

      await new Promise(resolve => setTimeout(resolve, 1000 / 20))
    }
  },
  name: 'tgen',
  description: 'Generates text using the markov text generation algorithim.',
  usage: 'tgen <path>',
  trust: 0,
  enabled: true
}
