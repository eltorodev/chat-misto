const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const cors = require('cors');

dotenv.config()

const app = express()

const server = require('http').createServer(app)

const io = require('socket.io')(server, {
  cors: {
    origin: "*",
  }
})

app.use(cors({
  origin: '*'
}))

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.get(process.env.BASE_URL, (request, response) => {
  response.send()
})

let messages = []


io.on('connection', socket => {
  console.log(`Socket conectado: ${socket.id}`)

  socket.emit('previousMessages', messages)

  socket.on('send', data => {
    messages.push(data)
    socket.broadcast.emit('receivedMessage', data)
  })
})

server.listen(process.env.PORT || 3000)