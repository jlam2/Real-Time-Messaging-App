const socket = io()

socket.on('message', (msg) => {
    document.querySelector("#output").innerHTML = msg
})

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()
    socket.emit('sendMessage', e.target.elements.message.value, (error) => {
        if(error){return console.log(error)}
        console.log('Message delivered')
    })
})

document.querySelector('#sendLocation').addEventListener('click', () => {
    if(!navigator.geolocation) return alert('Geolocation not supported by browser')

    navigator.geolocation.getCurrentPosition((pos) => {
        let long = pos.coords.latitude
        let lat = pos.coords.longitude
        socket.emit('sendLocation', {latitude: long ,longitude: lat}, () => {
            console.log("Location Shared")
        })
    })
})

