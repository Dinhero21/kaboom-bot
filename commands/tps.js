module.exports = {
  execute: Handler => {
    const { tps, player } = Handler.bot
    const { ping } = player
    const correctedTps = tps + (ping / (1000 / 20))

    Handler.tellraw([
      'Tps: ',
      {
        text: correctedTps.toString(),
        color: calculateTpsColor(tps)
      }
    ])

    function calculateTpsColor (tps) {
      if (tps > 15) return 'green'
      if (tps > 10) return 'yellow'
      if (tps > 5) return 'gold'
      if (tps > 1) return 'red'
      return 'dark_red'
    }
  },
  name: 'tps',
  description: 'Will return the server\'s tps.',
  usage: 'tps',
  trust: 0,
  enabled: true
}
