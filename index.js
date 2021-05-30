const express = require('express')
const path = require('path')
const dotenv = require('dotenv')

const app = express()

const server = require('http').createServer(app)

const io = require('socket.io')(server, {
  cors: {
    origin: "*",
  }
})

app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.get(process.env.BASE_URL, (request, response) => {
  response.send()
})

let messages = []

let users = []

io.on('connection', socket => {
  console.log('Socket connected')

  socket.on('connected', function(data) {
    users[socket.id] = data.user
  })

  socket.on('disconnect', function() {
    console.log(`Socket with user ${users[socket.id]} disconnected`)
    delete users[socket.id]
  })

  socket.emit('previousMessages', messages)

  socket.on('sendMessage', data => {
    messages.push(data)
    socket.broadcast.emit('receivedMessage', data)
  })
})

server.listen(process.env.APP_PORT || 3000)