const socket = io()

function createRoom() {
  let name = document.getElementById("name").value
  socket.emit("createRoom", name)
}

function joinRoom() {
  let name = document.getElementById("name").value
  let room = document.getElementById("room").value

  socket.emit("joinRoom", {
    username: name,
    room: room
  })
}

function sendMsg() {
  let msg = document.getElementById("msg").value
  if (msg === "") return

  socket.emit("sendMessage", msg)
  document.getElementById("msg").value = ""
}

document.getElementById("msg").addEventListener("input", () => {
  socket.emit("typing")
})

socket.on("roomCreated", (room) => {
  alert("Room: " + room)
})

socket.on("message", (data) => {
  let li = document.createElement("li")
  li.innerText = data.user + ": " + data.text
  document.getElementById("chat").appendChild(li)
})

socket.on("userCount", (num) => {
  document.getElementById("count").innerText = "Users: " + num
})

socket.on("typing", (name) => {
  document.getElementById("typing").innerText = name + " typing..."

  setTimeout(() => {
    document.getElementById("typing").innerText = ""
  }, 1000)
})