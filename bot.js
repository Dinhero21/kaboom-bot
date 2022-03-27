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

  options.username = generateRandomUsername(options.username, 3)

  const bot = new EventEmitter()

  bot._client = minecraft.createClient(options)

  bot.host = options.host
  bot.port = options.port

  bot.username = options.username

  bot.version = bot._client.version

  bot.chatQueue = []

  bot.write = (name, payload) => bot._client.write(name, payload)
  bot.chat = message => bot.chatQueue.push(message)
  bot.end = bot._client.end

  bot.removeAllListeners()

  bot.connected = false
  bot.loggedIn = false
  bot.position = {
    x: null,
    y: null,
    z: null
  }

  bot._client.on('connect', handleConnection)
  bot._client.on('login', handleLogin)
  bot._client.on('error', handleError)
  bot._client.on('end', handleEnd)
  bot._client.on('position', handlePositionChange)
  bot._client.on('chat', handleChat)
  bot._client.on('entity_status', handleEntityStatus)

  loadPlugins(bot)

  return bot

  function handleConnection () {
    bot.connected = true
    bot.emit('connect')
  }
  function handleLogin (packet) {
    bot.loggedIn = true
    bot.entityId = packet.entityId
    bot.uuid = bot._client.uuid

    bot.emit('login', packet)

    setInterval(tick, 1000 / 20)
    setInterval(chatQueue, 1000 / 20 * 5)
  }
  function handleError (error) {
    bot.emit('error', error)
  }
  function handleEnd (reason) {
    bot.connected = false
    bot.loggedIn = false

    bot.emit('end', reason)
  }
  function handlePositionChange (position) {
    bot.position = position

    bot.emit('position', position)
  }
  function handleChat (packet) {
    bot.emit('chat', packet)
  }
  function handleEntityStatus (packet) {
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
  }
  function chatQueue () {
    const message = bot.chatQueue.shift()

    if (message) bot.write('chat', { message })
  }
  function tick () {
    bot.emit('tick')
  }
  function generateRandomUsername (username, size) {
    return `${username}${Array(size).fill(0).map(() => `§${String.fromCharCode(Math.floor(Math.random() * 65535))}`).join('')}`
  }
}
function loadPlugins (bot) {
  plugins.forEach(plugin => {
    plugin.inject(bot)
  })
}

module.exports = { createBot }
