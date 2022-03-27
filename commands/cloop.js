class Cloop extends Command {
  run (args, username) {
    const [method, command] = args

    switch (method) {
      case 'add':
        if (!command) return

        this.handler.bot.cloop.add([...command].filter(char => char !== '"').join(''))
        break
      case 'clear':
        this.handler.bot.cloop.clear()
        break
      default:
        this.handler.error('Unknown method.')
        break
    }
  }
}

module.exports = {
  Command: Cloop,
  name: 'cloop',
  description: 'If method equals to add and a command is provided will append a command for the cloop. If method equals to clear will clear the cloop.',
  usage: 'cloop <method> <command>',
  trust: 0,
  enabled: true
}
