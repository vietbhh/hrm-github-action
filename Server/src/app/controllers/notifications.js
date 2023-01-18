import { sendNotification } from "#app/libraries/notifications/Notifications.js"

export const sendNotificationController = async (req, res, next) => {
  const { receivers, payload, data, saveToDb } = req.body
  const result = await sendNotification(
    req.userId,
    receivers,
    payload,
    data,
    saveToDb
  )
  return result ? res.respond(true) : res.fail("missing_notification_params")
}
