const socket = io('http://localhost:3000')

function renderMessage(message) {
  $('.messages').append(`
        <div class="message"><strong>${message.user}</strong>: ${message.text}</div>
      `)
}

socket.on('previousMessages', function (messages) {
  for (message of messages) {
    renderMessage(message)
  }
})

socket.on('receivedMessage', function (message) {
  renderMessage(message)
})

$('form').submit(function (event) {
  event.preventDefault()

  let user = $('input[name=user]').val()
  let text = $('input[name=text]').val()

  if (user.length && text.length) {
    const messageObject = {
      user: user,
      text: text,
    }

    renderMessage(messageObject)

    socket.emit('sendMessage', messageObject)
  }
})

socket.emit('connected', {user: 'João'})