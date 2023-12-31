const net = require("net")

module.exports = function (connection_options) {
  this.connection_options = connection_options
  this.timeout = 5000

  this.connected = false
  this.socket_client = undefined
  this.queue = []

  this.connect = () =>
    new Promise((resolve, reject) => {
      this.socket_client = net.connect(this.connection_options, () => {
        this.connected = true
        resolve(true)
      })

      // When a message arrives
      this.socket_client.on("data", (data) => {
        this.queue.shift().resolve(data)
      })

      this.socket_client.on("error", (error) => {
        this.connected = false

        if (this.queue.length > 0) this.queue.shift().reject(error)

        // Connection promise rejection
        reject(error)

        this.socket_client.end()
      })

      this.socket_client.on("end", () => {
        this.connected = false
      })
    })

  this.send = (message) => {
    // Returns a promise that is resolved externally or rejected after a certain timeout

    this.socket_client.write(message)

    return new Promise((resolve, reject) => {
      timeout = setTimeout(() => reject("timeout"), this.timeout)
      this.queue.push({ resolve, reject, timeout })
    })
  }

  this.disconnect = this.socket_client.end()
}
