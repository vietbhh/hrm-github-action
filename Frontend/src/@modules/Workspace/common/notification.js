import { sendNotification } from "#app/libraries/notifications/Notifications.js"
import { getUsers, usersModel, getUser } from "#app/models/users.mysql.js"
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

const sendNotificationApprovePost = async (
  infoWorkspace,
  hanlde,
  receivers
) => {
  const body =
    "Post in Workgroup " +
    "<strong>" +
    infoWorkspace?.name +
    "</strong>" +
    " has " +
    hanlde

  const link = "workspace/" + infoWorkspace?.id
  await sendNotification(1, receivers, { body: body, link: link })
}

const sendNotificationRequestJoin = async (infoWorkspace, receivers) => {
  console.log("sendNotificationRequestJoin infoWorkspace", infoWorkspace)
  const memberInfo = await getUser(
    infoWorkspace.request_joins[infoWorkspace.request_joins.length - 1].id_user
  )

  let body = "<strong>" + memberInfo?.dataValues?.full_name + "</strong>"
  if (infoWorkspace.request_joins.length >= 2) {
    body += " and " + (infoWorkspace.request_joins.length - 1) + " others"
  }
  body +=
    " sent a request to join workspace 1 <strong>" +
    infoWorkspace?.name +
    "</strong>"

  const link = "workspace/" + infoWorkspace?.id + "/request-join"
  await sendNotification(1, infoWorkspace?.administrators, {
    body: body,
    link: link
  })
}
export { sendNotificationApproveJoin, sendNotificationRequestJoin }
