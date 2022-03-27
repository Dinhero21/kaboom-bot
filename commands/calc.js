const math = require('mathjs')

class Calc extends Command {
  run (args, username) {
    const expression = args.join(' ')

    try {
      this.handler.tellraw([
        {
          text: 'Result: ',
          color: 'gray' // TODO: Add to colors
        },
        {
          text: math.evaluate(expression),
          color: this.handler.colors.number
        }
      ])
    } catch (error) {
      this.handler.error(error)
    }
  }
}

module.exports = {
  Command: Calc,
  name: 'calc',
  description: 'Calculates an mathematical expression.',
  usage: 'calc <expression>',
  trust: 0,
  enabled: true
}
