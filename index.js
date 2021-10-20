const express = require('express');
const http = require('http')
const socketIO = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketIO(server)

const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'))


io.on('connection', (socket) => {
    console.log('New web socket connection')
    socket.emit('message', 'Welcome to the chat app!')

    socket.on('sendMessage', (msg) => {
        io.emit('message', msg)
        console.log(msg)
    })
})

server.listen(port, () => {
  console.log('server started on port', port);
});