import { sendNotification } from "#app/libraries/notifications/Notifications.js"
import { getUser } from "#app/models/users.mysql.js"
import workspaceMongoModel from "../models/workspace.mongo.js"

const compactContent = (content = "") => {
  const contentPost = content
  let body = contentPost.replace(/<[^>]+>/g, "")
  if (body.length > 80) {
    body = body.substring(0, 80) + "..."
  }

  return '"' + body + '"'
}

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
  post,
  hanlde,
  receivers,
  sender
) => {
  const contentPost = post?.content

  let body = contentPost.replace(/<[^>]+>/g, "")

  if (body.length > 80) {
    body = body.substring(0, 80) + "..."
  }

  let link =
    hanlde === "approved" ? "workspace/" + infoWorkspace?.id + "?tab=feed" : ""

  const title =
    "Your post has been " + hanlde + " by <b>" + sender?.full_name + "</b>"
  if (!infoWorkspace?.name) {
    link = "posts/" + post._id
  }
  await sendNotification(sender.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(sender.id)
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

const sendNotificationReactionPost = async (
  post,
  userReaction,
  reaction,
  receivers
) => {
  const title =
    "<b>" +
    userReaction.full_name +
    "</b> " +
    reaction +
    " {{modules.network.notification.reaction_post_tag}}"
  const link = "posts/" + post._id
  const body = compactContent(post.content)

  console.log("title", title)
  console.log("bodybodybody", body)
  console.log("userReaction", userReaction)
  console.log("receivers", receivers)
  console.log("link", link)
  await sendNotification(userReaction?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(userReaction?.id)
  })
}
export {
  sendNotificationApproveJoin,
  sendNotificationApprovePost,
  sendNotificationPostPending,
  sendNotificationRequestJoin,
  sendNotificationUnseenPost,
  sendNotificationNewPost,
  sendNotificationReactionPost
}
