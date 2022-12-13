import { map } from "lodash-es"

export let socketUsers = []

const coreSocket = () => {
  global._io.on("connection", (socket) => {
    socket.join("friday")
    socketUsers.push({
      socketId: socket.id,
      ...socket.user
    })
    const userOnline = map(socketUsers, (user) => {
      return {
        id: user.id,
        full_name: user.full_name,
        username: user.username
      }
    })
    global._io.to("friday").emit("users_online", userOnline)
    socket.on("disconnect", () => {
      socket.leave("friday")
      socketUsers = socketUsers.filter((user) => user.socketId !== socket.id)
    })
  })
}

export default coreSocket
