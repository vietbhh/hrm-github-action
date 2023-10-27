import { notificationsModelMysql } from "#app/models/notifications.mysql.js"
import notificationMongoModel from "#app/models/notification.mongo.js"
import { getSettingsFromDB } from "#app/models/settings.mysql.js"
import { sendFirebaseNotification } from "#app/services/firebaseServices.js"
import { emitDataToOnlineUsers } from "#app/sockets/core.socket.js"
import { getAvatarUrl, getDefaultFridayLogo } from "#app/utility/common.js"
import { isEmpty, isNumber, isUndefined } from "lodash-es"

const saveNotificationMysql = async (
  updateNotification,
  idUpdate,
  dataUpdate,
  condition,
  dataSave
) => {
  if (updateNotification) {
    await notificationsModelMysql.update(dataUpdate, {
      where: {
        id: idUpdate,
        ...condition
      }
    })

    return idUpdate
  } else {
    try {
      const saveNotification = await notificationsModelMysql.create(dataSave, {
        __user: dataSave.sender_id,
        userId: dataSave.sender_id
      })

      return saveNotification.id
    } catch (error) {
      return 0
    }
  }
}

const saveNotificationMongo = async (
  updateNotification,
  idUpdate,
  dataUpdate,
  condition,
  dataSave
) => {
  if (updateNotification) {
    await notificationMongoModel.updateOne(
      { _id: idUpdate, ...condition },
      dataUpdate
    )

    return idUpdate
  } else {
    try {
      const saveEvent = await notificationMongoModel.save()

      return saveEvent._id
    } catch (error) {
      return 0
    }
  }
}

const getNotificationDB = async () => {
  const notificationDBSetting = await getSettingsFromDB("notification_db")
  const notificationDB =
    notificationDBSetting["default"]["Preferences.notification_db"]["value"] ===
      undefined ||
    isEmpty(
      notificationDBSetting["default"]["Preferences.notification_db"]["value"]
    )
      ? "mysql"
      : notificationDBSetting["default"]["Preferences.notification_db"]["value"]

  return notificationDB
}

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
    const notificationDB = await getNotificationDB()
    if (notificationDB === "mongo") {
      const dataUpdate = {
        sender_id: sender,
        recipient_id: receivers,
        title: title,
        link: link,
        icon: notificationIcon
      }
      if (popup) dataUpdate.read_by = []
      const result = await saveNotificationMongo(
        update_notification,
        idUpdate,
        dataUpdate,
        {},
        {
          __user: sender,
          sender_id: sender,
          recipient_id: receivers,
          type: type,
          title: title,
          body: body,
          link: link,
          actions: JSON.stringify(actions),
          icon: notificationIcon,
          custom_fields: custom_fields
        }
      )

      if (!result) {
        return false
      }
    } else {
      const dataUpdate = {
        sender_id: sender,
        recipient_id: JSON.stringify(receivers),
        title: title,
        link: link,
        icon: notificationIcon
      }
      if (popup) dataUpdate.read_by = "[]"
      const result = await saveNotificationMysql(
        update_notification,
        idUpdate,
        dataUpdate,
        {},
        {
          __user: sender,
          sender_id: sender,
          recipient_id: JSON.stringify(receivers),
          type: type,
          title: title,
          body: body,
          link: link,
          actions: JSON.stringify(actions),
          icon: notificationIcon,
          custom_fields: JSON.stringify(custom_fields)
        }
      )

      if (!result) {
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

const getNotificationById = async (idNotification) => {
  const notificationDB = await getNotificationDB()

  if (notificationDB === "mongo") {
    const notificationInfo = await notificationMongoModel.findOne({
      where: {
        _id: idNotification
      }
    })

    if (Object.keys(notificationInfo).length > 0) {
      const newNotificationInfo = {
        ...notificationInfo._doc,
        _id: notificationInfo["_id"].toString()
      }

      return newNotificationInfo
    }

    return {}
  } else {
    const notificationsModelMysql = new notificationsModelMysql()
    const infoNotification = await notificationsModelMysql.findOne({
      where: {
        id: idNotification
      }
    })

    return infoNotification
  }
}

const updateNotification = async (idNotification, dataUpdate) => {
  const notificationDB = await getNotificationDB()

  try {
    if (notificationDB === "mongo") {
      await notificationMongoModel.updateOne(
        {
          where: {
            _id: idNotification
          }
        },
        { $set: dataUpdate }
      )

      return true
    } else {
      const notificationsModelMysql = new notificationsModelMysql()
      await notificationsModelMysql.update(
        {
          ...dataUpdate
        },
        {
          where: {
            id: idNotification
          }
        }
      )

      return true
    }
  } catch (err) {
    return false
  }
}

const getListNotification = async (perPage = 10, page = 0, conditions = {}) => {
  const option = {}
  const limit = {}
  if (perPage != 0) {
    if (page > 0) {
      const currentPage = page - 1
      option["skip"] = perPage * currentPage
      limit["offset"] = perPage * currentPage
    }

    option["limit"] = parseInt(perPage)
    limit["limit"] = parseInt(perPage)
  }

  const notificationDB = await getNotificationDB()

  if (notificationDB === "mongo") {
    const listNotification = await notificationMongoModel.find(
      conditions,
      null,
      option
    )

    return listNotification
  } else {
    const notificationsModelMysql = new notificationsModelMysql()
    const listNotification = await notificationsModelMysql.findAll({
      ...conditions,
      ...limit
    })

    return listNotification
  }
}

const updateNotificationStatusAction = async (
  idNotification,
  indexNotification,
  status,
  msg = null
) => {
  const infoNotification = await getNotificationById(idNotification)

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

  await updateNotification(idNotification, {
    actions: JSON.stringify(newActions)
  })

  return actionUpdated
}

export {
  sendNotification,
  updateNotificationStatusAction,
  getNotificationById,
  updateNotification,
  getListNotification
}
