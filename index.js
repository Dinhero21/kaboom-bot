const config = require('./config.json')
const log4js = require('log4js')
const _ = require('lodash')
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

    // TODO: Make these libs
    bot.cspy = false
    bot.vanish = false

    bot.on('login', () => {
      logger.info('Logged in!')

      bot.createCore(config.core.size)
    })

    bot.on('position', () => {
      bot.core.fillCore()
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

      console.log(`[${bot.host}] ${data.ansi}${String.fromCharCode(27)}[0m`)

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
      console.log(`Kicked: ${reason}`)

      logger.error(`Kicked: ${reason}`)
    })

    bot.on('end', reason => {
      console.log(`Disconnected: ${reason}`)

      logger.error(`Disconnected: ${reason}`)

      setTimeout(handleBot, 1000 * process.env.RECONNECT_INTERVAL)
    })

    bot.on('error', error => {
      logger.error(error)
    })

    process.on('uncaughtException', error => {
      console.log(error)

      bot.util.error(`Fatal Error: ${error}`, '@a')

      logger.fatal(error)
    })
  }

  handleBot()
})
