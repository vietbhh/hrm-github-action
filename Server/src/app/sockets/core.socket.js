import { objectMap } from "#app/utility/common.js"
import { forEach, isArray, isUndefined } from "lodash-es"
export let socketUsers = {}

export const getUserSocketData = (userId) => {
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

const getOnlineUsers = (type = 0) => {
  const result = {}
  objectMap(socketUsers, (userId, user) => {
    result[userId] = {
      id: user.id,
      full_name: user.full_name,
      username: user.username,
      avatar: user.avatar,
      socketId: user.socketId,
      online_status: user.online_status
    }
  })
  return result
}

const emitDataToUserById = (userId, key, data) => {
  const receiverSocket = getUserSocketData(userId)
  if (receiverSocket) {
    global._io.to(receiverSocket.socketId).emit(key, data)
  }
}
export const emitDataToOnlineUsers = (userIds, key, data) => {
  if (isArray(userIds)) {
    forEach(userIds, (item) => {
      emitDataToUserById(item, key, data)
    })
  } else {
    emitDataToUserById(userIds, key, data)
  }
}

const coreSocket = () => {
  global._io.on("connection", (socket) => {
    socket.join("friday")
    socketUsers[socket.user.id] = {
      socketId: socket.id,
      online_status: "online",
      ...socket.user
    }
    global._io.to("friday").emit("users_online", getOnlineUsers())
    socket.on("disconnect", () => {
      socket.leave("friday")
      delete socketUsers[socket.user.id]
      global._io.to("friday").emit("users_online", getOnlineUsers())
    })

    socket.on("user_status_away", async () => {
      socketUsers[socket.user.id].online_status = "away"
      global._io.to("friday").emit("users_online", getOnlineUsers())
    })
    socket.on("user_status_online", async () => {
      socketUsers[socket.user.id].online_status = "online"
      global._io.to("friday").emit("users_online", getOnlineUsers())
    })

    //Handle Send data between client
    socket.on("send_data_to_users", async (socketData) => {
      const { receivers, key, data } = socketData
      emitDataToOnlineUsers(receivers, key, data)
    })
  })
}

export default coreSocket
