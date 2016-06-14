const socketIO = require('socket.io')
const Session = require('./session')

module.exports = (server) =>{
  const io = socketIO(server)
  io.on('connection', (socket) => {
    console.log('socket connected, id: ' + socket.id)
    const session = new Session(socket)
    session.initEvents()
  })
}