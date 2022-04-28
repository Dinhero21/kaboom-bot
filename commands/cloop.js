module.exports = {
  chat: handler => {
    const [method, ...command] = handler.args

    switch (method) {
      case 'add':
        if (!command) return

        handler.tellraw(command.join(' '))

        handler.bot.cloop.add(command.join(' '))
        break
      case 'clear':
        handler.bot.cloop.clear()
        break
      default:
        handler.error('Unknown method.')
        break
    }
  },
  name: 'cloop',
  description: 'If method equals to add and a command is provided will append a command for the cloop. If method equals to clear will clear the cloop.',
  usage: 'cloop <method> <command>',
  trust: 0,
  enabled: true
}
