import { sendNotification } from "#app/libraries/notifications/Notifications.js"
import { getUsers, usersModel, getUser } from "#app/models/users.mysql.js"
const sendNotificationApproveJoin = async (
  infoWorkspace,
  hanlde,
  receivers
) => {
  const body =
    "Request join Workgroup " +
    "<strong>" +
    infoWorkspace?.name +
    "</strong>" +
    " has " +
    hanlde

  const link = "workspace/" + infoWorkspace?.id
  await sendNotification(1, receivers, { title: "", body: body, link: link })
}

const sendNotificationRequestJoin = async (infoWorkspace, receivers) => {
  const memberInfo = await getUser(
    infoWorkspace.request_joins[infoWorkspace.request_joins.length - 1].id_user
  )

  let body = "<strong>" + memberInfo?.dataValues?.full_name + "</strong>"
  if (infoWorkspace.request_joins.length >= 2) {
    body += " and " + (infoWorkspace.request_joins.length - 1) + " others"
  }
  body +=
    " sent a request to join workgroup <strong>" +
    infoWorkspace?.name +
    "</strong>"
  const link = "workspace/" + infoWorkspace?.id + "/request-join"
  await sendNotification(1, infoWorkspace?.administrators, {
    title: "",
    body: body,
    link: link
  })
}

const sendNotificationApprovePost = async (
  infoWorkspace,
  hanlde,
  receivers
) => {
  const body =
    "Post in workgroup <strong>" +
    infoWorkspace?.name +
    "</strong> has been " +
    hanlde

  const link =
    hanlde === "approved" ? "workspace/" + infoWorkspace?.id + "?tab=feed" : ""
  await sendNotification(1, receivers, { title: "", body: body, link: link })
}

const sendNotificationPostPending = async (
  infoWorkspace,
  hanlde,
  receivers
) => {
  const body =
    "Post in <strong>" + workspaceName + "</strong> has been " + hanlde
  hanlde

  const link = "workspace/" + infoWorkspace?.id + "?tab=feed"
  await sendNotification(1, receivers, { title: "", body: body, link: link })
}
export {
  sendNotificationApproveJoin,
  sendNotificationRequestJoin,
  sendNotificationApprovePost,
  sendNotificationPostPending
}
