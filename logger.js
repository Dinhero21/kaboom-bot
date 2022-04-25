const config = require('./config.json')
const fs = require('fs')
const path = require('path')

class Logger {
  constructor (logPath) {
    this.path = path.join(logPath, `${Date.now()}.json`)
    this.value = []

    if (!fs.existsSync(logPath)) return

    let data = []

    for (const filename of fs.readdirSync(logPath)) {
      if (!/^\d+\.json$/.test(filename)) continue

      try {
        const filepath = path.join(logPath, filename)
        const content = JSON.parse(fs.readFileSync(filepath, 'utf8'))

        data.push(...content)
        fs.rmSync(filepath)
      } catch (error) {
        console.error(error)
      }
    }

    const latestPath = path.join(logPath, 'latest.json')

    if (fs.existsSync(latestPath)) data.push(...latestPath)

    data = data.sort((a, b) => a.time - b.time)

    fs.writeFileSync(latestPath, JSON.stringify(data))
  }

  write (data = {}) {
    this.value.push(data)

    const dirname = path.dirname(this.path)

    if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true })

    fs.writeFileSync(this.path, JSON.stringify(this.value))

    if (data.length > config.max_log_size) {
      this.value = []
      this.path = path.join(dirname, `${Date.now()}.json`)
    }
  }

  data (type = [], content = null) {
    this.write({
      type: Array.isArray(type) ? type : [type],
      data: content,
      time: Date.now()
    })
  }

  info (message) {
    this.data('info', message)
  }

  error (error) {
    this.data('error', error)
  }
}

module.exports = { Logger }
