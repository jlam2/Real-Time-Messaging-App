const socket = io()
socket.on('message', (msg) => {
    document.querySelector("#output").innerHTML = msg
})

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()

    socket.emit('sendMessage', e.target.elements.message.value)
})

