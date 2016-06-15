const socketIO = require('socket.io')
const Session = require('./session')
const hub = require('../hub')
const redisClient = require('../../utils/redis').client()

module.exports = (server) =>{
  const io = socketIO(server)
  io.on('connection', (socket) => {
    console.log('socket connected, id: ' + socket.id)

    const session = new Session(socket)
    redisClient.hset('sockets', session.userid, socket.id)
    hub.pushSocket(socket)

    session.initEvents()

    socket.on('disconnect', () => {
      delete socketMaps[session.userid]
    })
  })
}