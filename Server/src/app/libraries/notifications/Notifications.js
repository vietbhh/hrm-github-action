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
  const actions = payload?.actions || ""
  const custom_fields = payload?.custom_fields || "" // source_id , source_type ,
  const update_notification = payload?.update_notification || false
  const idUpdate = payload?.idUpdate || false
  const popup = payload?.popup ?? true
  if (isUndefined(receivers) || isUndefined(title) || isUndefined(body))
    return false

  let notificationIcon = getDefaultFridayLogo()
  if (icon) {
    notificationIcon = isNumber(icon) ? getAvatarUrl(icon) : icon
  }
  payload.icon = notificationIcon
  let notificationId = 0
  if (saveToDb) {
    if (update_notification) {
      const dataUpdate = {
        sender_id: sender,
        recipient_id: JSON.stringify(receivers),
        title: title,
        link: link,
        icon: notificationIcon
      }
      if (popup) dataUpdate.read_by = "[]"

      await notificationsModelMysql.update(dataUpdate, {
        where: {
          id: idUpdate
        }
      })
    } else {
      try {
        const saveNotification = await notificationsModelMysql.create(
          {
            sender_id: sender,
            recipient_id: JSON.stringify(receivers),
            type: type,
            title: title,
            body: body,
            link: link,
            actions: JSON.stringify(actions),
            icon: notificationIcon,
            custom_fields: JSON.stringify(custom_fields)
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
  }
  //for case when user online,push notification via socket
  if (popup) {
    emitDataToOnlineUsers(receivers, emitKey, {
      data,
      isSave: saveToDb,
      payload: { ...payload, sender_id: sender, id: notificationId }
    })
  }

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

const updateNotificationStatusAction = async (
  idNotification,
  indexNotification,
  status,
  msg = null
) => {
  const infoNotification = await notificationsModelMysql.findOne({
    where: {
      id: idNotification
    }
  })
  if (!infoNotification) {
    return false
  }

  const actions =
    infoNotification.actions === null
      ? []
      : JSON.parse(infoNotification.actions)

  let actionUpdated = {}
  const newActions = actions.map((item, index) => {
    if (parseInt(index) === parseInt(indexNotification)) {
      actionUpdated = {
        ...item,
        status: status,
        message: msg === null ? status : msg
      }
      return actionUpdated
    }

    return item
  })

  await notificationsModelMysql.update(
    {
      actions: JSON.stringify(newActions)
    },
    {
      where: {
        id: idNotification
      }
    }
  )

  return actionUpdated
}

export { sendNotification, updateNotificationStatusAction }
