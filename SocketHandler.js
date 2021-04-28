const net = require('net')


const SocketHandler = function(connection_options) {

  this.connection_options = connection_options
  this.timeout = 3000

  this.connected = false
  this.socket_client = undefined
  this.queue = []

  this.connect = () => {
    return new Promise( (resolve, reject) => {

      this.socket_client = net.connect( this.connection_options, () => {
        this.connected = true
        resolve(true)
      })

      this.socket_client.on('data', (data) => {
        // When a message arrives
        this.queue.shift().resolve(data.toString())
      })

      this.socket_client.on('error', (error) => {
        this.connected = false

        if(this.queue.length > 0) this.queue.shift().reject(error)

        // Connection promise rejection
        reject(error)

        this.socket_client.end()
      })

      this.socket_client.on('end', () =>{
        this.connected = false
      })

    })
  }

  this.disconnect = () => {
    this.socket_client.end()
  }

  this.send = (message) => {
    /*
    Returns a promise that is resolved externally
    or rejected after a certain timeout
    */

    this.socket_client.write(message)

    return new Promise( (resolve, reject) => {
      // timout management
      timeout = setTimeout(() => reject('timeout'), this.timeout)

      this.queue.push({resolve, reject, timeout})
    })

  }

}

module.exports = SocketHandler
