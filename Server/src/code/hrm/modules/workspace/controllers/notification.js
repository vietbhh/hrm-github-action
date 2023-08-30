import { sendNotification } from "#app/libraries/notifications/Notifications.js"
import { getUser } from "#app/models/users.mysql.js"
import workspaceMongoModel from "../models/workspace.mongo.js"
const sendNotificationApproveJoin = async (
  infoWorkspace,
  hanlde,
  receivers,
  sender
) => {
  const body =
    "Request join Workgroup " +
    "<strong>" +
    infoWorkspace?.name +
    "</strong>" +
    " has " +
    hanlde

  const link = "workspace/" + infoWorkspace?.id
  await sendNotification(sender, receivers, {
    title: "",
    body: body,
    link: link
  })
}

const sendNotificationRequestJoin = async (infoWorkspace, receivers) => {
  const link = "workspace/" + infoWorkspace?.id + "/request-join"

  if (infoWorkspace.request_joins[infoWorkspace.request_joins.length - 1]._id) {
    return
  }
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

  await sendNotification(
    memberInfo?.dataValues?.id,
    infoWorkspace?.administrators,
    {
      title: "",
      body: body,
      link: link,
      icon: memberInfo?.dataValues?.id
    }
  )
}

const sendNotificationApprovePost = async (
  infoWorkspace,
  hanlde,
  receivers,
  sender
) => {
  let body =
    "Post in workgroup <strong>" +
    infoWorkspace?.name +
    "</strong> has been " +
    hanlde

  if (!infoWorkspace?.name) {
    body = "Post in feed has been " + hanlde
  }
  const link =
    hanlde === "approved" ? "workspace/" + infoWorkspace?.id + "?tab=feed" : ""
  await sendNotification(sender, receivers, {
    title: "",
    body: body,
    link: link
  })
}

const sendNotificationPostPending = async (feed, sender) => {
  const workspaceInfo = await workspaceMongoModel.findById(feed.permission_ids)
  const body =
    "<strong>" +
    sender?.full_name +
    "</strong> has posted in workgroup <strong>" +
    workspaceInfo?.name +
    "</strong>"

  const link = "workspace/" + workspaceInfo?._id + "/pending-posts"

  await sendNotification(sender.id, workspaceInfo?.administrators, {
    title: "",
    body: body,
    link: link,
    icon: parseInt(sender.id)
  })
}

const sendNotificationUnseenPost = async (sender, receivers, link) => {
  await sendNotification(
    sender,
    receivers,
    {
      title: "",
      body: "{{modules.network.notification.notification_unseen}}",
      link: link
    },
    {
      skipUrls: ""
    }
  )
}

const sendNotificationNewPost = async (infoWorkspace, feed, receivers) => {
  const body =
    "<strong>" +
    feed?.created_by?.full_name +
    "</strong> posted a new post in workgroup <strong>" +
    infoWorkspace?.name +
    "</strong>"

  const link = "workspace/" + infoWorkspace?.id + "?tab=feed"

  await sendNotification(
    feed?.created_by?.id,
    receivers,
    {
      title: "",
      body: body,
      link: link
    },
    {
      skipUrls: ""
    }
  )
}

export {
  sendNotificationApproveJoin,
  sendNotificationApprovePost,
  sendNotificationPostPending,
  sendNotificationRequestJoin,
  sendNotificationUnseenPost,
  sendNotificationNewPost
}
