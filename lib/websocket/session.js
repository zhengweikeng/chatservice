const uuid = require('node-uuid')
const eventHandlers = require('./eventHandlers')

class Session {
  constructor(socket) {
    this.socket = socket
    this.sessionId = this.userid = uuid.v4()
    this.rooms = []
  }

  initEvents() {
    this.socket.on('joinRoom', eventHandlers.joinRoom.bind(this))
    this.socket.on('leaveRoom', eventHandlers.leaveRoom.bind(this))
    this.socket.on('disconnect', eventHandlers.disconnect.bind(this))
  }
}

module.exports = Session