const fs = require('fs')

class Logger {
  constructor (logPath) {
    this.value = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath)) : []
    this.path = logPath
  }

  write (data = {}) {
    this.value.push(data)
    fs.writeFileSync(this.path, JSON.stringify(this.value))
  }

  data (type = 'default', content = null) {
    this.write({
      type: type,
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
