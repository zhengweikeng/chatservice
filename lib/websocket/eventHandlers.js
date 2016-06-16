const uuid = require('node-uuid')
const redisClient = require('../../utils/redis').client()
const hub = require('../hub')

const getRoomKey = (roomId) => (`room#${roomId}`)

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

    redisClient.sadd(getRoomKey(roomId), ...Array.from(room))
    this.rooms.push(roomId)
    this.socket.join(roomId)
    this.socket.emit('joinRoom', {roomId})
  },

  leaveRoom(data) {
    redisClient.srem(getRoomKey(data.roomId), this.userid, (err, res) => {
      redisClient.smembers(getRoomKey(data.roomId), (err, roomMembers) => {
        if (roomMembers && !roomMembers.length) {
          redisClient.del(getRoomKey(data.roomId))
        }
      })
      this.socket.leave(data.roomId)
    })
  },

  disconnect() {
    this.rooms.forEach((roomId) => leaveRoom(roomId))
    redisClient.hdel('sockets', this.userid)
    hub.removeSocket(this.socket.id)

    this.socket = null
  }
}