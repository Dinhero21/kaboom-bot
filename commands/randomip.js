const ip = require('ip')

function generateRandomIp () {
  return ip.fromLong(Math.floor(Math.random() * (256 ** 4)))
}

module.exports = {
  chat (handler) {
    handler.tellraw({
      text: generateRandomIp(),
      color: 'green' // TODO: Add to colors.
    })
  },
  terminal (handler) {
    handler.log(generateRandomIp())
  },
  name: 'randomip',
  description: 'Generates a random ip.',
  usage: 'randomip',
  trust: 0,
  enabled: true
}
