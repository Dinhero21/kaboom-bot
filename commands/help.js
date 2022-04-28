const fs = require('fs')
const path = require('path')
const colors = require('colors/safe')
const discord = require('discord.js')

module.exports = {
  chat (handler) {
    const { args } = handler
    const command = args.join(' ')

    if (command) {
      // Get command properties
      const filepath = `commands/${command}.js`

      if (!fs.existsSync(filepath)) {
        handler.error('Could not find command!')
        return
      }

      let properties

      try {
        properties = eval(fs.readFileSync(filepath, 'utf8'))
      } catch (error) {
        handler.tellraw(error)
      }

      console.table(properties)

      for (const [propertie, value] of Object.entries(properties)) {
        handler.tellraw([
          {
            text: propertie,
            color: 'red',
            hoverEvent: {
              action: 'show_text',
              contents: [
                {
                  text: 'Click to copy!',
                  color: 'green'
                }
              ]
            },
            clickEvent: {
              action: 'copy_to_clipboard',
              value: propertie
            }
          },
          {
            text: ': ',
            color: 'white'
          },
          {
            text: value,
            color: 'blue',
            hoverEvent: {
              action: 'show_text',
              contents: [
                {
                  text: 'Click to copy!',
                  color: 'green'
                }
              ]
            },
            clickEvent: {
              action: 'copy_to_clipboard',
              value: value
            }
          }
        ])
      }
    } else {
      // Get all commands
      const commands =
      fs.readdirSync('commands')
        .filter(file => file.endsWith('.js'))
        .map(file => path.join('commands', file))
        .filter(filepath => fs.lstatSync(filepath).isFile())

      const broken = []
      const unsupported = []
      const supported = []

      for (const command of commands) {
        const basename = path.basename(command, '.js')

        let properties

        try {
          properties = eval(fs.readFileSync(command, 'utf8'))
        } catch (error) {
          broken.push({ name: basename })
          continue
        }

        if (!properties.chat) {
          unsupported.push(properties)
          continue
        }

        supported.push(properties)
      }

      handler.tellraw({
        text: 'Supported',
        color: 'green',
        bold: true
      })

      handler.tellraw(supported.map(command => [{
        text: command.name,
        color: 'green',
        hoverEvent: {
          action: 'show_text',
          contents: [
            {
              text: 'Click to expand!',
              color: 'green'
            }
          ]
        },
        clickEvent: {
          action: 'run_command',
          value: `${handler.config.prefix.chat}help ${command.name}`
        }
      }, ' ']))

      handler.tellraw({
        text: 'Unsupported',
        color: 'yellow',
        bold: true
      })

      handler.tellraw(unsupported.map(command => [{
        text: command.name,
        color: 'yellow',
        hoverEvent: {
          action: 'show_text',
          contents: [
            {
              text: 'Click to expand!',
              color: 'green'
            }
          ]
        },
        clickEvent: {
          action: 'run_command',
          value: `${handler.config.prefix.chat}help ${command.name}`
        }
      }, ' ']))

      handler.tellraw({
        text: 'Broken',
        color: 'red',
        bold: true
      })

      handler.tellraw(broken.map(command => [{
        text: command.name,
        color: 'red',
        hoverEvent: {
          action: 'show_text',
          contents: [
            {
              text: 'Click to expand!',
              color: 'green'
            }
          ]
        },
        clickEvent: {
          action: 'run_command',
          value: `${handler.config.prefix.chat}help ${command.name}`
        }
      }, ' ']))

      /*
      handler.tellraw({
        text: basename,
        color: properties.enabled ? properties.chat ? ['blue', 'red'][properties.trust] : 'black' : 'gray',
        hoverEvent: {
          action: 'show_text',
          contents: [
            {
              text: 'Click to expand!',
              color: 'green'
            }
          ]
        },
        clickEvent: {
          action: 'run_command',
          value: `${handler.config.prefix.chat}help ${basename}`
        }
      })
      */
    }
  },
  terminal (handler) {
    console.log('Running help for terminal!')

    const { args } = handler
    const command = args.join(' ')

    if (command) {
      const filepath = path.join('commands', `${command}.js`)

      if (!fs.existsSync(filepath)) {
        handler.error('Could not find command!')
        return
      }

      let properties

      try {
        properties = eval(fs.readFileSync(filepath, 'utf8'))
      } catch (error) {
        handler.error(error.message)
      }

      console.table(properties)

      for (const [propertie, value] of Object.entries(properties)) handler.log(propertie, value)
    } else {
      // Get all commands
      const commands =
      fs.readdirSync('commands')
        .filter(file => file.endsWith('.js'))
        .map(file => path.join('commands', file))
        .filter(filepath => fs.lstatSync(filepath).isFile())

      for (const command of commands) {
        const basename = path.basename(command, '.js')

        let properties

        try {
          properties = eval(fs.readFileSync(command, 'utf8'))
        } catch (error) {
          handler.error(colors.red(basename))
          continue
        }

        if (properties.terminal) {
          handler.log(colors.green(basename))

          continue
        }

        handler.log(colors.yellow(basename))
      }
    }
  },
  discord (handler) {
    const command = handler.args.join(' ')

    if (command) {
      const filepath = path.join('commands', `${command}.js`)

      console.log(filepath)

      if (!fs.existsSync(filepath)) {
        handler.error('Could not find the command!')
        return
      }

      let properties

      try {
        properties = eval(fs.readFileSync(filepath, 'utf8'))
      } catch (error) {
        handler.error(error)
        return
      }

      const propertiesEmbed = new discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle(command)

      for (let [propertie, value] of Object.entries(properties)) {
        if (typeof value === 'function') continue

        value = value.toString()

        propertiesEmbed.addField(propertie, value.toString(), true)
      }

      console.log(propertiesEmbed)

      handler.sendEmbed(propertiesEmbed)
    } else {
      const commands =
      fs.readdirSync('commands')
        .filter(file => file.endsWith('.js'))
        .map(file => path.join('commands', file))
        .filter(filepath => fs.lstatSync(filepath).isFile())

      const supported = []
      const unsupported = []
      const broken = []

      for (const command of commands) {
        const basename = path.basename(command, '.js')

        let properties

        try {
          properties = eval(fs.readFileSync(command, 'utf8'))
        } catch (error) {
          broken.push(basename)
          continue
        }

        if (properties.discord) {
          supported.push(basename)

          continue
        }

        unsupported.push(basename)
      }

      const commandsEmbed = new discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('Commands')
        .addFields(
          { name: 'Supported', value: supported.map(command => `\`${command}\``).join(' ') },
          { name: 'Unsupported', value: unsupported.map(command => `\`${command}\``).join(' ') },
          { name: 'Broken', value: broken.map(command => `\`${command}\``).join(' ') }
        )

      handler.sendEmbed(commandsEmbed)
    }
  },
  name: 'help',
  description: 'Shows all commands while if specified shows the description of the command.',
  usage: 'help [<command>]',
  trust: 0,
  enabled: true
}
