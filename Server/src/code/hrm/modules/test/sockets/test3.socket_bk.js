/* let users = []
const docSocket = global._io.of("/document")
const testSocket = () => {
  docSocket.on("connection", (socket) => {
    socket.on("disconnect", () => {
      users = users.filter((user) => user.socketId !== socket.id)
    })
    socket.on("identity", (userId) => {
      users.push({
        socketId: socket.id,
        userId: userId
      })
      console.log(23, users)
    })
  })
}

export default testSocket
 */