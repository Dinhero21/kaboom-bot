/* global Command */

class Run extends Command {
  run (args, username) {
    const command = args.join(' ')

    this.handler.bot.core.run(command)
  }
}

module.exports = {
  Command: Run,
  name: 'run',
  description: 'Runs a command inside a command block.',
  usage: 'run <command>',
  trust: 0,
  enabled: true
}
