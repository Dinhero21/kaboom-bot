const quotes = require('inspirational-quotes')

class Inspire extends Command {
  run (args, username) {
    const quote = quotes.getQuote()

    this.handler.tellraw([
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
  }
}

module.exports = {
  Command: Inspire,
  name: 'inspire',
  description: 'Inspires you.',
  usage: 'inspire',
  trust: 0,
  enabled: true
}
