module.exports = {
  execute: Handler => {
    const error = Handler.args.join(' ')

    if (!error) Handler.error('Invalid error.')
    else Handler.error(error)
  },
  name: 'error',
  description: 'Will error an provided error.',
  usage: 'error <error>',
  trust: 0,
  enabled: true
}
