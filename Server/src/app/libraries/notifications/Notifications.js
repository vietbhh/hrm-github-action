import { notificationsModel } from "#app/models/notifications.model.mysql.js"
import { sendFirebaseNotification } from "#app/services/firebaseServices.js"
import { emitDataToOnlineUsers } from "#app/sockets/core.socket.js"

const sendNotification = async (
  sender,
  receivers,
  payload,
  data = {},
  saveToDb = true,
  emitKey = "app_notification"
) => {
  //save notification to database if need
  const { title, body, link, type } = payload
  let notificationId = 0
  if (saveToDb) {
    const saveNotification = await notificationsModel.friCreate(
      {
        sender_id: sender,
        recipient_id: JSON.stringify(receivers),
        type: type,
        title: title,
        body: body,
        link: link
      },
      sender
    )
    notificationId = saveNotification.id
  }

  //for case when user online,push notification via socket
  emitDataToOnlineUsers(receivers, emitKey, {
    data,
    isSave: saveToDb,
    payload: { ...payload, sender_id: sender, id: notificationId }
  })

  //for case when user is not focus on the app or user offline,push notification via firebase
  sendFirebaseNotification(receivers, payload, {
    isSave: saveToDb.toString(),
    emitKey: emitKey,
    sender_id: sender.toString(),
    id: notificationId.toString(),
    ...data
  })
}

export { sendNotification }
