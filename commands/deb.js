class Deb extends Command {
  run (args, username) {
    let block = args.join(' ')

    if (!block) return this.handler.error(this.handler.errors.INVALID_INPUT)

    block = block.toLowerCase()

    switch (block) {
      case 'on':
        this.handler.bot.exploits.blockde(true)
        break
      case 'off':
        this.handler.bot.exploits.blockde(false)
        break
      default:
        this.handler.error(this.handler.errors.SPECIFY_ON_OR_OF)
        break
    }
  }
}

module.exports = {
  Command: Deb,
  name: 'deb',
  description: 'Destroy blocker.',
  usage: 'deb [<on|off>]',
  trust: 0,
  enabled: true
}
