import { sendNotification } from "#app/libraries/notifications/Notifications.js"
const sendNotificationApproveJoin = async (
  infoWorkspace,
  hanlde,
  receivers
) => {
  const body =
    "Request to join Workgroup " +
    "<strong>" +
    infoWorkspace?.name +
    "</strong>" +
    " has " +
    hanlde

  const link = "workspace/" + infoWorkspace?.id
  await sendNotification(1, receivers, { body: body, link: link })
}

export { sendNotificationApproveJoin }
