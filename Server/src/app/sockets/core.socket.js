import { notificationsModel } from "#app/models/notifications.model.mysql.js"
import { getUser } from "#app/models/users.model.mysql.js"
import { sendNotification } from "#app/services/firebaseServices.js"
import { objectMap } from "#app/utility/common.js"
import { isUndefined, map } from "lodash-es"

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
    socket.on("send_data_to_users", async (data) => {
      const receiver = getUserSocketData(data.receiver)
      if (data.push_notification) {
        const user = await getUser(data.receiver)
        if (user.device_token) {
          const device_tokens = JSON.parse(user.device_token)
          const tokens_list = map(device_tokens, (item) => item.token)
          sendNotification(tokens_list, data.data)
        }
      }
      if (data.save_notification) {
        notificationsModel.create({
          
        })
      }
      if (receiver) {
        global._io.to(receiver.socketId).emit(data.key, data.data)
      }
    })
  })
}

export default coreSocket
