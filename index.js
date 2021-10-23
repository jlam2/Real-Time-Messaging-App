const express = require('express');
const http = require('http')
const socketIO = require('socket.io')
const Filter = require('bad-words')

const generateMessage = require('./utils/messages.js')

const app = express();
const server = http.createServer(app)
const io = socketIO(server)

const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'))

io.on('connection', (socket) => {
    console.log('New web socket connection')

    socket.on('join_room', ({username, room}) => {
        socket.join(room)

        socket.emit('message', generateMessage('Welcome to the chat app!'))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`))
    })

    socket.on('send_message', (msg, cb) => {
        const filter = new Filter()
        if (filter.isProfane(msg)) return cb("No profanity in messages please")

        io.emit('message', generateMessage(msg))
        cb()
    })

    socket.on('send_location', (coords, cb) => {
        io.emit('maps_URL', generateMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        cb()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left'))
    })
})

server.listen(port, () => {
    console.log('server started on port', port);
});