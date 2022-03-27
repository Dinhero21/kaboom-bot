const config = require('./config.json')
const log4js = require('log4js')
const { createBot } = require('./bot.js')

require('dotenv').config()

log4js.configure({
  appenders: {
    chat: {
      type: 'file',
      filename: `logs/${config.bot.host}.log`
    }
  },
  categories: {
    default: {
      appenders: ['chat'],
      level: 'all'
    }
  }
})

const logger = log4js.getLogger('chat')

config.servers.forEach(server => {
  // TODO: Make a handleBot file to handle the bots

  function handleBot () {
    const bot = createBot({
      username: config.bot.username,
      password: config.bot.password,
      version: config.bot.version,
      host: server.host,
      port: server.port
    })

    // TODO: Make these libs
    bot.cspy = false
    bot.vanish = false

    bot.on('login', () => {
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

      console.log(`[0m${data.ansi}${String.fromCharCode(27)}`)

      logger.debug(data.raw)
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

    bot.on('end', reason => {
      setTimeout(handleBot, 1000 * 10)
    })
  }

  handleBot()
})
