const config = require('./config.json')
const log4js = require('log4js')
const {createBot} = require('./bot.js')

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
const bot = createBot(config.bot)
bot.cspy = false
bot.vanish = false

bot.on('login', login)
bot.on('message', handleMessage)
bot.on('tick', tick)
bot.on('end', end)
bot.on('position', fillCore)
bot.on('error', console.error)
bot.on('parsed_chat', handleParsedChat)

function login() {
  console.log('Bot logged in!')

  bot.createCore(config.core.size)

  setInterval(fillCore, 1000 * 60)

  setInterval(() => {
    if(!bot.cspy) bot.chat('/c on')
    if(!bot.vanish) bot.chat('/v on')
  }, 1000)

  setInterval(bot.ban.tick, 1000)
  setInterval(bot.whitelist.tick, 1000)
}
function tick() {
  if(bot.op) {
    if(bot.gamemode !== null && bot.gamemode !== 1) bot.chat('/gmc')
  } else bot.chat(`/op ${bot.uuid}`)

  bot.cloop.tick()
}
function end(end) {
  console.log(`Disconnected: ${end}`)

  process.exit(1)
}
function fillCore() {
  console.log('Filling core!')

  bot.core.fillCore()
}
function handleMessage(username, message) {
  if(username === bot.username) return

  message = message.replaceAll(/§./g, '')

  if(message.startsWith(config.prefix)) {
    message = message.substring(config.prefix.length)

    const args = message.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g)

    if(!args) return bot.chat('Error: Invalid syntax.')

    bot.command.chat.run(args[0], args.slice(1), username)
  }
}
function handleParsedChat(data) {
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

  for(const filter in filters) {
    const regex = new RegExp(filter, 'gi')

    if(regex.test(data.clean)) filters[filter](data)
  }

  const reset = '\033[0m'

  console.log(`${reset}${data.ansi}`)

  logger.debug(data.raw)
}
