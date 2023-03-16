import { notificationsModelMysql } from "#app/models/notifications.mysql.js"
import { sendFirebaseNotification } from "#app/services/firebaseServices.js"
import { emitDataToOnlineUsers } from "#app/sockets/core.socket.js"
import { getAvatarUrl, getDefaultFridayLogo } from "#app/utility/common.js"
import { isNumber, isUndefined } from "lodash-es"

const sendNotification = async (
  sender,
  receivers,
  payload,
  data = {},
  saveToDb = true,
  emitKey = "app_notification"
) => {
  const title = payload?.title
  const body = payload?.body
  const link = payload?.link
  const icon = payload?.icon
  const type = payload?.type || "other"

  if (isUndefined(receivers) || isUndefined(title) || isUndefined(body))
    return false

  let notificationIcon = getDefaultFridayLogo()
  if (icon) {
    notificationIcon = isNumber(icon) ? getAvatarUrl(icon) : icon
  }
  payload.icon = notificationIcon
  let notificationId = 0
  if (saveToDb) {
    try {
      const saveNotification = await notificationsModelMysql.create(
        {
          sender_id: sender,
          recipient_id: JSON.stringify(receivers),
          type: type,
          title: title,
          body: body,
          link: link,
          icon: notificationIcon
        },
        {
          __user: sender,
          userId: sender
        }
      )
      notificationId = saveNotification.id
    } catch (error) {
      return false
    }
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
  return true
}

export { sendNotification }