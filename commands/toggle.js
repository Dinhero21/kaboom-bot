module.exports = {
  execute: Handler => {
    const configuration = Handler.args.join(' ')

    if (Object.keys(Handler.config.toggle).includes(configuration)) Handler.config.toggle[configuration] = !Handler.config.toggle[configuration]
    else Handler.bot.chat(`Unknown toggle. Toggles: ${Object.keys(Handler.config.toggle).join(', ')}.`)
  },
  name: 'toggle',
  description: 'Toggles a boolean configuration.',
  usage: 'toggle <configuration>',
  trust: 0,
  enabled: true
}
