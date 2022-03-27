const insult = require('insult')

class Insult extends Command {
  run (args, username) {
    super.run(args, username)

    this.handler.tellraw({
      text: insult.Insult()
    })
  }
}

module.exports = {
  Command: Insult,
  name: 'insult',
  description: 'Reverse of inspire.',
  usage: 'insult',
  trust: 0,
  enabled: true
}
