const socket = io('/')


const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector('.container')
const audio = new Audio('sound.mp3')


const append = (message, position) => {
    const messageElement = document.createElement('div')
    messageElement.innerText = message;
    messageElement.classList.add('message')
    messageElement.classList.add(position)
    messageContainer.append(messageElement)

    if (position == 'left') {
        audio.play()
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value
    append(`You : ${message}`, 'right')
    socket.emit('send', message)
    messageInput.value = ''
})


let userName = prompt('enter your name to join ...')

socket.emit('new-user-joined', userName)

socket.on('user-joined', name => {

    append(`${name} joined the chat `, 'center')
})

socket.on('receive', data => {

    append(`${data.name} : ${data.message}`, 'left')
})

socket.on('leave', data => {
    append(`${data} left the chat.`, 'center')
})