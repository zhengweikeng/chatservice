const express = require('express')
const app = express()
const server = require('http').Server(app)
const websocket = require('./lib/websocket/server')

websocket(server)

app.get('/', (req, res) => {
  res.send('hello world')
})

const port = process.env.port || 3000
server.listen(3000, () => {
  console.log(`server started on port: ${port}`)
})