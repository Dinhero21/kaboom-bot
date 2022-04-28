module.exports = {
  chat (handler) {
    handler.tellraw({
      text: 'Join the discord at https://discord.gg/PRJxNGKSHe or http://gg.gg/dinutil-discord',
      clickEvent: {
        action: 'open_url',
        value: 'https://discord.gg/PRJxNGKSHe'
      }
    }, '@a')
  },
  discord (handler) {
    handler.send('https://discord.gg/PRJxNGKSHe')
  },
  name: 'discord',
  description: 'Discord :)',
  usage: 'discord',
  trust: 0,
  enabled: true
}
