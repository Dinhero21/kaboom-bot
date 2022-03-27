module.exports = {
  execute: Handler => {
    let block = Handler.args.join(' ')

    if (!block) return Handler.error('Please specify on or off!')

    block = block.toLowerCase()

    if (block === 'on') Handler.bot.exploits.blockde(true)
    else if (block === 'off') Handler.bot.exploits.blockde(false)
    else Handler.error('Invalid specification! Please specify on or off!')
  },
  name: 'deb',
  description: 'De block.',
  usage: 'deb [<on|off>]',
  trust: 0,
  enabled: true
}
