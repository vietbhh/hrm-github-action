import { sendNotification } from "#app/libraries/notifications/Notifications.js"

const notificationsSocket = () => {
  global._io.on("connection", (socket) => {
    //Handle App Notification
    socket.on("app_notification", async (socketData) => {
      console.log("zz")
      const { receivers, data, payload, save_notification } = socketData
      sendNotification(
        socket.user.id,
        receivers,
        payload,
        data,
        save_notification
      )
    })

    //Handle Chat Notification
    socket.on("chat_notification", async (socketData) => {
      const { receivers, payload, data } = socketData
      sendNotification(
        socket.user.id,
        receivers,
        payload,
        data,
        false,
        "chat_notification"
      )
    })
  })
}

export default notificationsSocket
