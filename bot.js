const fs = require('fs')
const minecraft = require('minecraft-protocol')
const { EventEmitter } = require('events')

const plugins = fs.readdirSync('plugins').filter(filename => filename.endsWith('.js')).map(filename => require(`./plugins/${filename}`))

function createBot (options = {}) {
  options.username = options.username ?? 'Player'
  options.password = options.password ?? false
  options.host = options.host ?? 'localhost'
  options.port = options.port ?? 25565
  options.version = options.version ?? '1.18.1'

  const bot = new EventEmitter()

  bot._client = minecraft.createClient(options)

  bot.host = options.host
  bot.port = options.port

  bot.username = options.username

  bot.version = bot._client.version

  bot.chatQueue = []
  bot.cspy = false
  bot.vanish = false

  bot.write = (name, payload) => bot._client.write(name, payload)
  bot.chat = message => bot.chatQueue.push(message)
  bot.end = bot._client.end
  bot.loadPlugins = () => {
    loadPlugins(bot)
  }

  bot.removeAllListeners()

  bot.connected = false
  bot.loggedIn = false
  bot.position = {
    x: null,
    y: null,
    z: null
  }

  bot._client.on('connect', () => {
    bot.connected = true
    bot.emit('connect')
  })
  bot._client.on('login', packet => {
    bot.loggedIn = true
    bot.entityId = packet.entityId
    bot.uuid = bot._client.uuid

    bot.emit('login', packet)

    setInterval(tick, 1000 / 20)
    setInterval(chatQueue, 1000 / 20 * 5)
  })
  bot._client.on('error', error => {
    bot.emit('error', error)
  })
  bot._client.on('end', reason => {
    bot.connected = false
    bot.loggedIn = false

    bot.emit('end', reason)
  })
  bot._client.on('position', position => {
    bot.position = position

    bot.emit('position', position)
  })
  bot._client.on('chat', packet => {
    bot.emit('chat', packet)
  })
  bot._client.on('entity_status', packet => {
    if (packet.entityId === bot.entityId) {
      switch (packet.entityStatus) {
        case 24:
          bot.op = false

          bot.emit('deop')
          break
        case 28:
          bot.op = true

          bot.emit('op')
          break
        default:
          console.log(`Entity status: ${packet.entityStatus}`)
          break
      }
    }

    bot.emit('entity_status', packet)
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
  })

  return bot

  function chatQueue () {
    const message = bot.chatQueue.shift()

    if (message) bot.write('chat', { message })
  }
  function tick () {
    bot.emit('tick')
  }
}
function loadPlugins (bot) {
  plugins.forEach(plugin => {
    plugin.inject(bot)
  })
}

module.exports = { createBot }
