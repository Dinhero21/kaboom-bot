const quotes = require('inspirational-quotes')

module.exports = {
  chat: handler => {
    const quote = quotes.getRandomQuote()

    handler.tellraw([
      {
        text: quote.text,
        color: this.handler.colors.quote.text
      },
      ' - ',
      '"',
      {
        text: quote.author,
        color: this.handler.colors.quote.author
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
