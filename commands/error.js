module.exports = {
  chat (handler) {
    const error = handler.args.join(' ')

    handler.error(error)
  },
  name: 'error',
  description: 'Will error an provided error.',
  usage: 'error <error>',
  trust: 0,
  enabled: true
}
