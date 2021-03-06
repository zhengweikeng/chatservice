const io = require('socket.io-client')
const url = process.env.url || 'localhost'
const port = process.env.port || '3000'
const socket = io(`http://${url}:${port}`)

socket.on('connection', (datas) => {
  const userId = datas.userId
  console.log(`userId: ${userId}`)
  socket.emit('joinRoom', {
    userId: userId
  })
})

socket.on('joinRoom', (datas) => {
  console.log(`roomId: ${datas.roomId}`)
})