const express = require('express');
const http = require('http')
const socketIO = require('socket.io')
const Filter = require('bad-words')

const generateMessage = require('./utils/messages.js')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users.js')

const app = express();
const server = http.createServer(app)
const io = socketIO(server)

const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'))

io.on('connection', (socket) => {
    console.log('New web socket connection')

    socket.on('join_room', ({ username, room }, cb) => {
        const { error, user } = addUser(socket.id, username, room)

        if (error) return cb(error)

        socket.join(user.room)

        socket.emit('message', generateMessage('System', 'Welcome to the chat app!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('System', `${user.username} has joined!`))
        io.to(user.room).emit('room_data', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        cb()
    })

    socket.on('send_message', (msg, cb) => {
        const user = getUser(socket.id)

        const filter = new Filter()
        if (filter.isProfane(msg)) return cb("No profanity in messages please")

        io.to(user.room).emit('message', generateMessage(user.username, msg))
        cb()
    })

    socket.on('send_location', (coords, cb) => {
        const user = getUser(socket.id)

        const msg = `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
        io.to(user.room).emit('maps_URL', generateMessage(user.username, msg))
        cb()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('System', `${user.username} has left`))
            io.to(user.room).emit('room_data', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log('server started on port', port);
});