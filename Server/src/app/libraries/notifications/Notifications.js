import { notificationsModelMysql } from "#app/models/notifications.mysql.js"
import { sendFirebaseNotification } from "#app/services/firebaseServices.js"
import { emitDataToOnlineUsers } from "#app/sockets/core.socket.js"
import { getAvatarUrl, getDefaultFridayLogo } from "#app/utility/common.js"
import feedMongoModel from "../../../code/hrm/modules/feed/models/feed.mongo.js"
import { isNumber, isUndefined, map } from "lodash-es"
import { Op, Sequelize } from "sequelize"
const handleJsonQueryString = (column, key, value, compare = "=") => {
  let compareValue = value
  const compareStr = compare === "=" ? " NOT " : " "
  let query =
    "JSON_SEARCH(" +
    key +
    ",'one','" +
    compareValue +
    "') IS" +
    compareStr +
    "NULL"
  return query
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
  const senderFull = payload?.senderFull || ""

  if (isUndefined(receivers) || isUndefined(title) || isUndefined(body))
    return false

  let notificationIcon = getDefaultFridayLogo()
  if (icon) {
    notificationIcon = isNumber(icon) ? getAvatarUrl(icon) : icon
  }
  payload.icon = notificationIcon
  let notificationId = 0
  if (saveToDb) {
    console.log("update_notification", update_notification)
    if (update_notification) {
      console.log("run ifffffffffff")
      const infoPost = await feedMongoModel.findOne({
        _id: custom_fields?.source_id
      })
      const reactionPost = infoPost.reaction
      let numberReaction = 0
      reactionPost.map((reaction) => {
        const count = reaction.react_user.length
        numberReaction += count
      })
      console.log("numberReactionnumberReaction", numberReaction)
      console.log("infoPost", infoPost)
      const infoNotification = await notificationsModelMysql.findAll({
        where: {
          [Op.and]: [
            Sequelize.literal(
              "JSON_EXTRACT(custom_fields,'$.source_id') = " +
                "'" +
                custom_fields?.source_id +
                "'"
            )
          ]
        }
      })
      if (infoNotification) {
        infoNotification.map((item) => {
          console.log("item map ", item)
          const idUpdate = item?.id
          const title = "<b>" + senderFull?.full_name + "</b>"
          const dataUpdate = {
            sender_id: icon,
            read_by: [],
            title: title
          }
        })
      }

      return
    } else {
      console.log("run elseeeeeeeeee")
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
