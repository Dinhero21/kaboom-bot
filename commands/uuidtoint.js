module.exports = {
  chat (handler) {
    const { args } = handler
    const uuid = args.join(' ')

    handler.bot.tellraw(`[I;${handler.util.UUIDToInt(uuid).value.join()}]`)
  },
  name: 'test',
  description: 'Test command.',
  usage: null,
  trust: 0,
  enabled: true
}
