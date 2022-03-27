class Error extends Command {
  run (args, username) {
    super.run(args, username)

    const error = args.join(' ')

    this.handler.error(error)
  }
}

module.exports = {
  Command: Error,
  name: 'error',
  description: 'Will error an provided error.',
  usage: 'error <error>',
  trust: 0,
  enabled: true
}
