const fs = require('fs')
const path = require('path')

class Logger {
  constructor (logPath) {
    this.value = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath)) : []
    this.path = logPath
  }

  write (data = {}) {
    this.value.push(data)

    const dirname = path.dirname(this.path)

    if (!fs.existsSync(dirname)) fs.mkdirSync(dirname)

    fs.writeFileSync(this.path, JSON.stringify(this.value))
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
