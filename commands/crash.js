module.exports = {
  chat (handler) {
    const method = handler.args.join(' ')

    handler.bot.exploits.crash(method)
  },
  name: 'crash',
  description: 'Server goes boom.',
  usage: 'crash <method>',
  trust: 0,
  enabled: true
}
