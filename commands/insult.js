const { Insult } = require('insult')

module.exports = {
  execute: Handler => {
    const insult = Insult()

    Handler.tellraw({
      text: insult,
      color: Handler.colors.insult
    })
  },
  name: 'insult',
  description: 'Reverse of inspire.',
  usage: 'insult',
  trust: 0,
  enabled: true
}
