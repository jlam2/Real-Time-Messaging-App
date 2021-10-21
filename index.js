const express = require('express');
const http = require('http')
const socketIO = require('socket.io')
const Filter = require('bad-words')

const app = express();
const server = http.createServer(app)
const io = socketIO(server)

const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'))


io.on('connection', (socket) => {
    console.log('New web socket connection')
    socket.emit('message', 'Welcome to the chat app!')
    socket.broadcast.emit('message', 'A new user has joined')

    socket.on('sendMessage', (msg, cb) => {
        const filter = new Filter()
        if(filter.isProfane(msg)) return cb("No profanity in messages please")

        io.emit('message', msg)
        cb()
    })

    socket.on('sendLocation', (coords, cb) => {
        io.emit('message',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        cb()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })
})

server.listen(port, () => {
  console.log('server started on port', port);
});