module.exports = {
  chat (handler) {
    const message = handler.args.join(' ')

    handler.bot.chat(message)
  },
  discord (handler) {
    const message = handler.args.join(' ')

    handler.bot.chat(message)
  },
  name: 'chat',
  description: 'Echos text back.',
  usage: 'chat <message>',
  trust: 0,
  enabled: true
}
