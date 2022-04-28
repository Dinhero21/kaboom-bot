const config = require('./config.json')
const { createBot } = require('./bot.js')
const { Logger } = require('./logger.js')
const path = require('path')
const discord = require('discord.js')
const { createInterface } = require('readline')

require('dotenv').config()

const servers = process.env.SERVERS.split(',')

const cli = createInterface({
  input: process.stdin,
  output: process.stdout
})

const log = global.console.log
global.console.log = (...args) => {
  // cli.pause()
  cli.output.write('\x1b[2K\r')
  log.apply(console, Array.prototype.slice.call(args))
  // cli.resume()
  cli._refreshLine()
}

setInterval(() => {
  cli.output.write('\x1b[2K\r')
  cli._refreshLine()
}, 1000)

const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES] })

client.login(process.env.TOKEN)

const bots = {}

client.on('messageCreate', message => {
  for (const bot of Object.values(bots)) {
    bot.discord.onMessage(message)
  }
})

servers.forEach(server => {
  const logPath = path.join('logs', server)
  const logger = new Logger(logPath)
  let [host, port] = server.split(':')

  port = port ?? 25565

  function handleBot () {
    const bot = createBot({
      username: generateRandomUsername(4 + Math.floor(Math.random() * 8)),
      version: config.version,
      host: host,
      port: port
    })

    bots[server] = bot

    bot.logger = logger

    bot.discord = {
      client: client
    }

    bot.loadPlugins()

    bot.on('tick', bot.cloop.tick)

    bot.on('login', () => {
      logger.info('Logged in!')

      log('Logged in!')

      cli.on('line', line => {
        if (line.startsWith('/')) {
          bot.chat(line)

          return
        }

        if (line.startsWith(config.prefix.chat)) {
          line = line.substring(config.prefix.chat.length)

          const args = line.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g)

          bot.command.terminal.run(args[0], args.slice(1))

          return
        }

        if (line.startsWith(config.prefix.terminal)) {
          line = line.substring(config.prefix.terminal.length)

          const args = line.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g)
          const message = args.slice(1).join(' ')

          if (!bot.util) {
            console.error('Util was not found.')

            return
          }

          switch (args[0]) {
            case 'exit':
              bot.end()

              process.exit(0)
            case 'sudo':
              if (message === 'off') {
                bot.sudo = false
                break
              }

              bot.sudoUsername = message
              bot.sudo = true

              break
            case 'core':
              bot.core.run(message)
              break
            case 'chat':
              bot.chat(message)
          }

          return
        }

        if (bot.sudo) {
          bot.core.run(`sudo ${bot.sudoUsername} c:${line}`)

          return
        }

        if (!bot.util) {
          console.error('Util was not found.')

          return
        }

        bot.util.tellraw([
          {
            text: '[',
            color: config.colors.terminal.prefix.outline
          },
          {
            text: 'Terminal',
            color: config.colors.terminal.prefix.text
          },
          {
            text: ']',
            color: config.colors.terminal.prefix.outline
          },
          ' ',
          {
            text: 'Dinhero21',
            color: config.colors.terminal.username
          },
          ': ',
          {
            text: line,
            color: 'white'
          }
        ])
      }, '@a')

      bot.createCore(config.core.size)
    })

    bot.on('parsed_chat', data => {
      log(`${data.ansi}${String.fromCharCode(27)}[0m`)

      logger.data('parsed_chat', data.raw)
    })

    bot.on('message', (username, message) => {
      logger.data('chat', { username, message })

      if (username === bot.username) return

      message = message.replaceAll(/§./g, '')

      if (message.startsWith(config.prefix.chat)) {
        message = message.substring(config.prefix.chat.length)

        const args = message.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g)

        if (!args) return bot.chat('Error: Invalid syntax.')

        bot.command.chat.run(args[0], args.slice(1), username)
      }
    })

    bot.on('cspy', (username, command) => {
      logger.data('cspy', { username, command })
    })

    bot.on('kick_disconnect', reason => {
      log(`Kicked: ${reason}`)

      logger.data(['kicked', 'end'], reason)
    })

    bot.on('end', reason => {
      log(`Disconnected: ${reason}`)

      logger.data(['disconnected', 'end'], reason)

      setTimeout(handleBot, process.env.RECONNECT_INTERVAL)
    })

    bot.on('error', error => {
      log(error)

      logger.error(error)
    })

    // TODO: Switch to another thing because setInterval can create memory leaks.
    setInterval(() => {
      if (!bot.op) {
        chat('/op @p')
        return
      }

      if (!bot.cspy) chat('/c on')
      if (!bot.vanish) chat('/v on')

      bot.filter.tick()

      // Use custom function because bot.chat uses queue.
      function chat (message) {
        bot._client.write('chat', { message })
      }
    }, 1000 * 5)

    process.on('uncaughtException', error => {
      log(error.stack)

      logger.data('fatal_error', error.stack)
    })

    function log (message) {
      console.log(`[${bot.host}] ${message}`)
    }

    setInterval(advertise, 1000 * 60 * 5)

    function advertise () {
      if (!bot.util) return

      bot.util.tellraw([
        {
          text: 'Click ',
          color: 'white'
        },
        {
          text: 'here',
          color: 'aqua',
          underlined: true,
          clickEvent: {
            action: 'open_url',
            value: 'https://discord.gg/PRJxNGKSHe'
          }
        },
        {
          text: ' or type ',
          color: 'white'
        },
        {
          text: `${config.prefix.chat}discord`,
          color: 'red',
          clickEvent: {
            action: 'run_command',
            value: `${config.prefix.chat}discord`
          }
        },
        {
          text: ' to join ',
          color: 'white'
        },
        {
          text: 'Dinutil',
          color: 'green'
        },
        {
          text: '\'s ',
          color: 'white'
        },
        {
          text: 'Discord',
          color: 'blue'
        }
      ])
      bot.util.tellraw([
        {
          text: 'Type ',
          color: 'white'
        },
        {
          text: `${config.prefix.chat}help`,
          underlined: true,
          color: 'aqua',
          clickEvent: {
            action: 'run_command',
            value: `${config.prefix.chat}help`
          }
        },
        {
          text: ' to get command list!',
          color: 'white'
        }
      ], '@a')
    }
  }

  handleBot()
})

function generateRandomUsername (length) {
  return Array.from({ length }, () => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 62)]).join('')
}
