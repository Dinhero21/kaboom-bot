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

      log('Logged in!')

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

    process.on('uncaughtException', error => {
      log(error)

      bot.util.error(`Fatal Error: ${error}`, '@a')

      logger.fatal(error)
    })

    function log (message) {
      console.log(`[${bot.host}] ${message}`)
    }
  }

  handleBot()
})
