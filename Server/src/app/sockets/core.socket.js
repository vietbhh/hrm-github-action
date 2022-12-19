import { objectMap } from "#app/utility/common.js"
import { isArray, isEmpty, isUndefined } from "lodash-es"

export let socketUsers = {}

export const isUserOnline = (userId) => {
  if (!isUndefined(socketUsers[userId.toString()])) {
    return socketUsers[userId.toString()]
  } else {
    return false
  }
}

export const getUserSocketId = (userId) => {
  if (!isUndefined(socketUsers[userId.toString()]?.socketId)) {
    return socketUsers[userId.toString()]?.socketId
  } else {
    return false
  }
}
const getOnlineUsers = () => {
  const result = {}
  objectMap(socketUsers, (userId, user) => {
    result[userId] = {
      id: user.id,
      full_name: user.full_name,
      username: user.username,
      avatar: user.avatar,
      socketId: user.socketId
    }
  })
  return result
}

const coreSocket = () => {
  global._io.on("connection", (socket) => {
    socket.join("friday")
    socketUsers[socket.user.id] = {
      socketId: socket.id,
      ...socket.user 
    }
    global._io.to("friday").emit("users_online", getOnlineUsers())
    socket.on("disconnect", () => {
      socket.leave("friday")
      delete socketUsers[socket.user.id]
      global._io.to("friday").emit("users_online", getOnlineUsers())
    })
   
    //Handle Send data between client
    socket.on("send_data_to_users", (data) => {
      const receiver = getUserSocketId(data.receiver)
      if (receiver) {
        global._io.to(receiver).emit(data.key, data.data)
      }
      /* if (!isUndefined(socketUsers[data.receiver]?.socketId)) {
        global._io
          .to(socketUsers[data.receiver].socketId)
          .emit(data.key, data.data)
      } */
    })
  })
}

export default coreSocket
