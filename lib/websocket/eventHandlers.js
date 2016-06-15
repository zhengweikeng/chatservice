const uuid = require('node-uuid')
const redisClient = require('../../utils/redis').client()
const hub = require('../hub')

module.exports = {
  joinRoom(data) {
    let roomId = uuid.v4()
    if (data.roomId && typeof data.roomId === 'string')
      roomId = data.roomId

    const room = new Set()
    room.add(this.userId)
    if (data.partnerId) {
      redisClient.hget('sockets', data.partnerId, (err, socketId) => {
        const partnerSocket = hub.getSocket(socketId)
        if (partnerSocket) {
          partnerSocket.join(roomId)
          room.add(data.partnerId)   
        }
      })
    }

    this.rooms[roomId] = room
    this.socket.join(roomId)
    this.socket.emit('joinRoom', {roomId})
  },

  leaveRoom(data) {
    this.rooms[data.roomId].delete(this.userid)
    if(this.rooms[data.roomId].size() === 0) {
      delete this.rooms[data.roomId]
      // this.socket.to(data.roomId).emit('closeRoom')
    }
    this.socket.leave(data.roomId)
  },

  disconnect() {
    redisClient.hdel('sockets', this.userid)
    hub.removeSocket(this.socket.id)
  }
}