module.exports = {
  execute: Handler => {
    let [method, command, times] = Handler.args

    switch (method) {
      case 'add':
        if (!command) return

        command = [...command].filter(char => char !== '"').join('')

        Handler.bot.cloop.add(command)
        break
      case 'clear':
        Handler.bot.cloop.clear()
        break
      default:
        Handler.error('Unknown method.')
        break
    }
  },
  name: 'cloop',
  description: 'If method equals to add and a command is provided will append a command for the cloop. If method equals to clear will clear the cloop.',
  usage: 'cloop <method> <command> <times>',
  trust: 0,
  enabled: true
}
