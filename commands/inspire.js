const { getQuote } = require('inspirational-quotes')

module.exports = {
  execute: Handler => {
    const quote = getQuote()

    Handler.tellraw([
      {
        text: quote.text,
        color: Handler.colors.quote.text
      },
      ' - ',
      '"',
      {
        text: quote.author,
        color: Handler.colors.quote.author
      },
      '"'
    ])
  },
  name: 'inspire',
  description: 'Inspires you.',
  usage: 'inspire',
  trust: 0,
  enabled: true
}
