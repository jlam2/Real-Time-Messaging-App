const socket = io()

//elements
const messageForm = document.querySelector('form')
const messageFormInput = messageForm.querySelector('input')
const messageFormButton = messageForm.querySelector('button')
const sendLocationButton = document.querySelector('#sendLocation')
const messages = document.querySelector('#messages')


//templates
const msgTemplate = document.querySelector('#msgTemplate').innerHTML
const mapsURLTemplate = document.querySelector('#mapsURLTemplate').innerHTML

//options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

//display msg on the page with timestamp
socket.on('message', (msg) => {
    console.log(msg.text)

    const html = Mustache.render(msgTemplate, {
        timestamp: moment(msg.timestamp).format('h:mm a'),
        message: msg.text
    })
    messages.insertAdjacentHTML('beforeend', html)
})

//displays a message link of a users location
socket.on('maps_URL', (msg) => {
    console.log(msg.text)

    const html = Mustache.render(mapsURLTemplate, {
        timestamp: moment(msg.timestamp).format('h:mm a'),
        url: msg.text
    })
    messages.insertAdjacentHTML('beforeend', html)
})

//send user message to server
messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    messageFormButton.setAttribute('disabled', 'disabled')

    socket.emit('send_message', e.target.elements.message.value, (error) => {
        messageFormButton.removeAttribute('disabled')
        messageFormInput.value = ''
        messageFormInput.focus()

        if (error) { return console.log(error) }
        console.log('Message delivered')
    })
})

//send user location to server
sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) return alert('Geolocation not supported by browser')

    sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((pos) => {
        socket.emit('send_location',
            { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
            () => {
                sendLocationButton.removeAttribute('disabled')
                console.log("Location Shared")
            }
        )
    })
})

socket.emit('join_room', {username, room})
