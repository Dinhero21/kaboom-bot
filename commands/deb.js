
module.exports = {
  chat (handler) {
    let block = handler.args.join(' ')

    if (!block) return handler.error(handler.errors.INVALID_INPUT)

    block = block.toLowerCase()

    switch (block) {
      case 'on':
        handler.bot.exploits.blockde(true)
        break
      case 'off':
        handler.bot.exploits.blockde(false)
        break
      default:
        handler.error('Please specify on or off.')
        break
    }
  },
  name: 'deb',
  description: 'Destroy entity blocker.',
  usage: 'deb [<on|off>]',
  trust: 0,
  enabled: true
}
