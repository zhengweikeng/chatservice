const socketIO = require('socket.io')
const Session = require('./session')
const hub = require('../hub')
const redisClient = require('../../utils/redis').client()

module.exports = (server) =>{
  const io = socketIO(server)
  io.on('connection', (socket) => {
    console.log('socket connected, id: ' + socket.id)

    socket.session = new Session(socket)
    redisClient.hset('sockets', socket.session.userId, socket.id)
    hub.pushSocket(socket)

    socket.emit('connection', {
      userId: socket.session.userId
    })
    socket.session.initEvents()
  })
}