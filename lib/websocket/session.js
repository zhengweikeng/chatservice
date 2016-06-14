const uuid = require('node-uuid')
const eventHandlers = require('./eventHandlers')

class Session {
  constructor(socket) {
    this.socket = socket
    this.sessionId = uuid.v4()
  }

  initEvents() {
    this.socket.on('joinRoom', eventHandlers.joinRoom.bind(this))
    this.socket.on('leaveRoom', eventHandlers.leaveRoom.bind(this))
  }
}

module.exports = Session