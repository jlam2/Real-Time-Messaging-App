const socket = io()

//elements
const messageForm = document.querySelector('form')
const messageFormInput = messageForm.querySelector('input')
const messageFormButton = messageForm.querySelector('button')
const sendLocationButton = document.querySelector('#sendLocation')
const messages = document.querySelector('#messages')

//templates
const msgTemplate = document.querySelector('#msgTemplate').innerHTML

socket.on('message', (msg) => {
    console.log(msg)
    
    const html = Mustache.render(msgTemplate, {message: msg})
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
            {latitude: pos.coords.longitude ,longitude: pos.coords.latitude}, 
            () => {
                sendLocationButton.removeAttribute('disabled')
                console.log("Location Shared")
            }
        )
    })
})

