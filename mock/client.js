const io = require('socket.io-client')
const url = process.env.url || 'localhost'
const port = process.env.port || '3000'
const socket = io(`http://${url}:${port}`)
