const uuid = require('node-uuid')

module.exports = {
  joinRoom(message) {
    this.roomId = uuid.v4()
    this.socket.join(this.roomId)
  },

  leaveRoom() {
    this.socket.leave(this.roomId)
  }
}