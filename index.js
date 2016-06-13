const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

io.on('connection', (socket) => {
  console.log('socket connected')
  socket.on('disconnect', () => {
    console.log('socket disconnect')
  })
})



app.get('/', (req, res) => {
  res.send('hello world')
})

const port = process.env.port || 3000
server.listen(3000, () => {
  console.log(`server started on port: ${port}`)
})