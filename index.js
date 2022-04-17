const config = require('./config.json')
const log4js = require('log4js')
const _ = require('lodash')
const { createInterface } = require('readline')
const { createBot } = require('./bot.js')

require('dotenv').config()

const servers = process.env.SERVERS.split(',')

log4js.configure({
  appenders: _.zipObject(servers, servers.map(server => {
    return {
      type: 'file',
      filename: `logs/${server.split(':')[0]}.log`
    }
  })),
  categories: {
    ..._.zipObject(servers, servers.map(server => {
      return {
        appenders: [server],
        level: 'all'
      }
    })),
    default: {
      appenders: servers,
      level: 'all'
    }
  }
})

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

process.env.SERVERS.split(',').forEach(server => {
  const logger = log4js.getLogger(server)
  let [host, port] = server.split(':')

  port = port ?? 25565

  function handleBot () {
    const bot = createBot({
      username: config.bot.username,
      password: config.bot.password,
      version: config.bot.version,
      host: host,
      port: port
    })

    bot.logger = logger

    // TODO: Make these libs
    bot.cspy = false
    bot.vanish = false

    bot.on('login', () => {
      logger.info('Logged in!')

      log('Logged in!')

      cli.on('line', line => {
        if (line.startsWith('/')) {
          bot.chat(line)

          return
        }

        if (line.startsWith(config.prefix)) {
          line = line.substring(config.prefix.length)

          const args = line.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g)

          bot.command.terminal.run(args[0], args.slice(1))

          return
        }

        if (line.startsWith('.')) {
          line = line.substring('.'.length)

          const args = line.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g)
          const message = args.slice(1).join(' ')

          switch (args[0]) {
            case 'exit':
              bot.end()

              process.exit(0)
            case 'sudo':
              if (message === 'off') {
                bot.sudo = false
                break
              }

              bot.sudousername = message
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
          bot.core.run(`sudo ${bot.sudousername} c:${line}`)

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
      const filters = {
        '^Successfully disabled CommandSpy$': data => {
          bot.cspy = false
        },
        '^Successfully enabled CommandSpy$': data => {
          bot.cspy = true
        },
        '^Vanish for .*: disabled$': data => {
          bot.vanish = false
        },
        '^You are now completely invisible to normal users, and hidden from in-game commands.$': data => {
          bot.vanish = true
        }
      }

      for (const filter in filters) {
        const regex = new RegExp(filter, 'gi')

        if (regex.test(data.clean)) filters[filter](data)
      }

      log(`${data.ansi}${String.fromCharCode(27)}[0m`)

      logger.info(data.raw)
    })

    bot.on('message', (username, message) => {
      if (username === bot.username) return

      message = message.replaceAll(/§./g, '')

      if (message.startsWith(config.prefix)) {
        message = message.substring(config.prefix.length)

        const args = message.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g)

        if (!args) return bot.chat('Error: Invalid syntax.')

        bot.command.chat.run(args[0], args.slice(1), username)
      }
    })

    bot.on('kick_disconnect', reason => {
      log(`Kicked: ${reason}`)

      logger.error(`Kicked: ${reason}`)
    })

    bot.on('end', reason => {
      log(`Disconnected: ${reason}`)

      logger.error(`Disconnected: ${reason}`)

      setTimeout(handleBot, process.env.RECONNECT_INTERVAL)
    })

    bot.on('error', error => {
      log(error)

      logger.error(error)
    })

    // TODO: Switch to another thing becouse setInterval can create memory leaks.
    setInterval(() => {
      if (!bot.op) {
        chat('/op @p')
        return
      }

      if (!bot.cspy) chat('/c on')
      if (!bot.vanish) chat('/v on')

      // Use custom function becouse bot.chat uses queue.
      function chat (message) {
        bot._client.write('chat', { message })
      }
    }, 1000 * 5)

    /*
    process.on('uncaughtException', error => {
      log(error)

      bot.util.error(`Fatal Error: ${error}`, '@a')

      logger.fatal(error)
    })
    */

    function log (message) {
      console.log(`[${bot.host}] ${message}`)
    }
  }

  handleBot()
})
