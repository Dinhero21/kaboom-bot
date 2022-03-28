const fs = require('fs')
const path = require('path')

class Help extends Command {
  run (args, username) {
    super.run(args, username)

    const handler = this.handler
    const command = args.join(' ')

    if (command) {
      const filepath = `./commands/${command}.js`

      if (fs.existsSync(filepath)) {
        const properties = eval(fs.readFileSync(filepath, 'utf8'))

        for (const [propertie, value] of Object.entries(properties)) {
          handler.tellraw([
            {
              text: propertie,
              color: 'red' // TODO: Add in colors
            },
            {
              text: ': ',
              color: 'white' // TODO: Add in colors
            },
            {
              text: value,
              color: 'blue' // TODO: Add in colors
            }
          ])
        }
      } else {
        handler.error(handler.config.errors.UNKNOWN_COMMAND)
      }
    } else {
      const commands = fs.readdirSync('commands').map(command => `commands/${command}`).filter(filepath => fs.statSync(filepath).isFile()).filter(filepath => filepath.endsWith('.js'))

      for (const command of commands) {
        const basename = path.basename(command, '.js')

        const properties = eval(fs.readFileSync(command, 'utf8'))

        handler.tellraw({
          text: basename,
          color: properties.execute ? 'yellow' : properties.enabled ? handler.colors.permission[properties.trust] : handler.colors.disabled,
          clickEvent: {
            action: 'run_command',
            value: `${handler.config.prefix}help ${basename}`
          },
          hoverEvent: {
            action: 'show_text',
            contents: [
              {
                text: `Click to expand ${basename}.`,
                color: 'green' // TODO: Add in colors
              }
            ]
          }
        })
      }
    }
  }
}

module.exports = {
  Command: Help,
  name: 'help',
  description: 'Shows all commands while if specified shows the description of the command.',
  usage: 'help [<command>]',
  trust: 0,
  enabled: true
}
