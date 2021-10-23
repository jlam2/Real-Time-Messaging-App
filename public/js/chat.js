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


//display msg on the page with timestamp
socket.on('message', (msg) => {
    console.log(msg)
    
    const html = Mustache.render(msgTemplate, {
        timestamp: moment(msg.timestamp).format('h:mma'), 
        message: msg.text
    })
    messages.insertAdjacentHTML('beforeend', html)
})

//displays a link the a users location
socket.on('mapsURL', (url) => {
    console.log(url)

    const html = Mustache.render(mapsURLTemplate, {url: url})
    messages.insertAdjacentHTML('beforeend', html)
})

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    messageFormButton.setAttribute('disabled', 'disabled')

    socket.emit('sendMessage', e.target.elements.message.value, (error) => {
        messageFormButton.removeAttribute('disabled')
        messageFormInput.value = ''
        messageFormInput.focus()
        
        if(error){return console.log(error)}
        console.log('Message delivered')
    })
})

document.querySelector('#sendLocation').addEventListener('click', () => {
    if(!navigator.geolocation) return alert('Geolocation not supported by browser')

    sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((pos) => {
        socket.emit('sendLocation', 
            {latitude: pos.coords.latitude, longitude: pos.coords.longitude }, 
            () => {
                sendLocationButton.removeAttribute('disabled')
                console.log("Location Shared")
            }
        )
    })
})

