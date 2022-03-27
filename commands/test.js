class Test extends Command {
  run (args, username) {
    super.run(args, username)

    this.handler.bot._client.end()
  }
}

module.exports = {
  Command: Test,
  name: 'test',
  description: 'Test command.',
  usage: null,
  trust: 0,
  enabled: true
}
