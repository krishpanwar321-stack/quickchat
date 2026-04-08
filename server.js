const express = require("express")
const http = require("http")
const socketio = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static("public"))

function makeRoom() {
  return Math.random().toString(36).substr(2, 4).toUpperCase()
}

io.on("connection", (socket) => {

  socket.on("createRoom", (name) => {
    let room = makeRoom()

    socket.join(room)
    socket.username = name
    socket.room = room

    socket.emit("roomCreated", room)

    io.to(room).emit("message", {
      user: "System",
      text: name + " joined"
    })

    update(room)
  })

  socket.on("joinRoom", (data) => {
    let name = data.username
    let room = data.room

    socket.join(room)
    socket.username = name
    socket.room = room

    io.to(room).emit("message", {
      user: "System",
      text: name + " joined"
    })

    update(room)
  })

  socket.on("sendMessage", (msg) => {
    let room = socket.room
    let name = socket.username

    io.to(room).emit("message", {
      user: name,
      text: msg
    })
  })

  socket.on("typing", () => {
    socket.to(socket.room).emit("typing", socket.username)
  })

  socket.on("disconnect", () => {
    if (!socket.room) return

    io.to(socket.room).emit("message", {
      user: "System",
      text: socket.username + " left"
    })

    update(socket.room)
  })

  function update(room) {
    let users = io.sockets.adapter.rooms.get(room)
    let count = users ? users.size : 0
    io.to(room).emit("userCount", count)
  }

})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log("server started")
})