const uuid = require('node-uuid')
const redisClient = require('../../utils/redis').client()
const hub = require('../hub')

const getRoomKey = (roomId) => (`room#${roomId}`)

const handlers = {
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
    const that = this
    redisClient.srem(getRoomKey(data.roomId), this.userId, (err, res) => {
      redisClient.smembers(getRoomKey(data.roomId), (err, roomMembers) => {
        if (roomMembers && !roomMembers.length) {
          redisClient.del(getRoomKey(data.roomId))
        }
      })
    })
  },

  disconnect() {
    console.log(this.rooms)
    const that = this
    this.rooms.forEach((roomId) => handlers.leaveRoom.call(that, {roomId}))
    redisClient.hdel('sockets', this.userId)
    hub.removeSocket(this.socket.id)

    this.socket = null
  }
}

module.exports = handlers