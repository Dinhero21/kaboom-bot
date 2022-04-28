module.exports = {
  chat (handler) {
    const command = handler.args.join(' ')

    handler.core.run(command)
  },
  discord (handler) {
    const command = handler.args.join(' ')

    handler.core.run(command)
  },
  name: 'run',
  description: 'Runs a command inside a command block.',
  usage: 'run <command>',
  trust: 0,
  enabled: true
}
