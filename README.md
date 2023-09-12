# SocketReqRes

The built-in NodeJS 'net' module allows for simple TCP connection and data exchange between network devices.
It operates in an event-driven fashion and thus all incoming data is handled in a single callback.

Oftentimes, devices such as PLCs are designed to respond with data immediately upon receiving a valid message.
Such design pattern brings communication with those devices close to request/response types of communication such as with HTTP.

Nevertheless, since the 'net' module handles all responses in the same callback, it can be difficult to properly identify which response corresponds to which message.
This module attempts to solve this shortfall by adding a promise-based handling of messages and their response, similar to how Axios manages HTTP requests.

## Usage

```javascript
const SocketReqRes = require("@jtekt/socket-req-res")

const device = new SocketReqRes({ host: "192.168.1.2", port: 8080 })

device
  .connect()
  .then(() => {
    console.log(`Device connected`)
    return device.send("my first message")
  })
  .then((response) => {
    console.log(response)
    return device.send("my second message")
  })
  .catch(console.log)
```
