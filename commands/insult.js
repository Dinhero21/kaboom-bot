const insult = require('insult')

module.exports = {
  chat: handler => {
    handler.tellraw({
      text: insult.Insult()
    })
  },
  name: 'insult',
  description: 'Reverse of inspire.',
  usage: 'insult',
  trust: 0,
  enabled: true
}
