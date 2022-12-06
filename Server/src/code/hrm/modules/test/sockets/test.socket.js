import { socketUsers } from "#app/sockets/core.socket.js"

const testSocket = (client) => {
  console.log(22,socketUsers)
  client.on("connection", () => {
    console.log(2, "dis")
  })
}

export default testSocket
