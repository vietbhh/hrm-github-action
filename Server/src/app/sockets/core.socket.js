export let socketUsers = []

const coreSocket = (client) => {
  client.on("disconnect", () => {
    socketUsers = socketUsers.filter((user) => user.socketId !== client.id)
  })
  // add identity of user mapped to the socket id
  client.on("identity", (userId) => {
    socketUsers.push({
      socketId: client.id,
      userId: userId
    })
  })
}

export default coreSocket
