const socketHub = {}
module.exports = {
  pushSocket(socket) {
    socketHub[socket.id] = socket
    return socketHub
  },

  getSocket(socketId) {
    return sockerHub[socketId]
  },

  removeSocket(socketId) {
    delete socketHub[socketId]
    return socketHub
  }
}