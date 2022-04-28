module.exports = {
  chat (handler) {
    handler.core.fillCore()
  },
  discord (handler) {
    handler.core.fillCore()
  },
  name: 'rc',
  description: 'Refill core.',
  usage: 'rc',
  trust: 0,
  enabled: true
}
