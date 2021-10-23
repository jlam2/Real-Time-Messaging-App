const users = []

function addUser(id, username, room) {
    //clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) return { error: "username and room are required" }

    //check if username already exists in room
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    if (existingUser) return { error: "username is already in use" }

    const user = { id, username, room }
    users.push(user)

    return { user }
}

function removeUser(id) {
    const index = users.findIndex((user) => user.id === id)

    if (index != -1) return users.splice(index, 1)[0]
}

function getUser(id) {
    return users.find((user) => user.id === id)
}

function getUsersInRoom(room) {
    return users.filter((user) => user.room === room)
}

module.exports = {addUser, removeUser, getUser, getUsersInRoom}