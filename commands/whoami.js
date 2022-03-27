module.exports = {
  execute: Handler => {
    Handler.tellraw({
      text: Handler.username,
      color: Handler.colors.username,
      clickEvent: {
        action: 'run_command',
        value: `${Handler.config.prefix}playerinfo ${Handler.username}`
      },
      hoverEvent: {
        action: 'show_text',
        contents: [
          {
            text: 'Click to see more info about yourself.',
            color: Handler.colors.open
          }
        ]
      }
    }, '@a')
  },
  name: 'whoami',
  description: 'Returns username.',
  usage: 'whoami',
  trust: 0,
  enabled: true
}
