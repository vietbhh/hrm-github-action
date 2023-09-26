import { sendNotification } from "#app/libraries/notifications/Notifications.js"
import { getUser } from "#app/models/users.mysql.js"
import workspaceMongoModel from "../models/workspace.mongo.js"

const compactContent = (content = "") => {
  const contentPost = content
  let body = contentPost.replace(/<[^>]+>/g, "")
  body = body.replace(/\u00a0/g, "")

  if (body.length > 80) {
    body = body.substring(0, 80) + "..."
  }

  return body
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
    " {{modules.network.notification.sent_request_join_workgroup}} <strong>" +
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
    "</strong> {{modules.network.notification.has_posted_workgroup}} <strong>" +
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

const sendNotificationUnseenPost = async (post, sender, receivers) => {
  const title =
    "<b>" +
    sender?.full_name +
    "</b>" +
    " {{modules.network.notification.asked_to_see_this_post}}"

  const body = compactContent(post?.content)
  const link = "post/" + post?._id
  await sendNotification(
    sender?.id,
    receivers,
    {
      title: title,
      body: body,
      link: link,
      icon: parseInt(sender?.id)
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
    "</strong> {{modules.network.notification.posted_new_post_workgroup}} <strong>" +
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
    " {{modules.network.notification.reaction_post}}"
  const link = "posts/" + post._id
  const body = compactContent(post.content)

  await sendNotification(userReaction?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(userReaction?.id),
    custom_fields: { source_id: post._id, source_type: "reaction" },
    update_notification: true
  })
}

const sendNotificationReactionPostTag = async (
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
  await sendNotification(userReaction?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(userReaction?.id)
  })
}
const sendNotificationCommentPost = async (post, user, comment, receivers) => {
  const title =
    "<b>" +
    user.full_name +
    "</b> {{modules.network.notification.commented_on_your_post}}"
  const link = "posts/" + post._id
  const body = compactContent(comment)
  await sendNotification(user?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(user?.id)
  })
}

const sendNotificationCommentPostTag = async (
  post,
  userReaction,
  comment,
  receivers
) => {
  const title =
    "<b>" +
    userReaction.full_name +
    "</b> {{modules.network.notification.comment_post_tag}}"
  const link = "posts/" + post._id
  const body = compactContent(comment)
  await sendNotification(userReaction?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(userReaction?.id)
  })
}

const sendNotificationTagInCommentPost = async (
  post,
  userReaction,
  comment,
  receivers
) => {
  const title =
    "<b>" +
    userReaction.full_name +
    "</b> {{modules.network.notification.tag_comment}}"
  const link = "posts/" + post._id
  const body = compactContent(comment)
  await sendNotification(userReaction?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(userReaction?.id)
  })
}

const sendNotificationTagInPost = async (post, user, comment, receivers) => {
  const title =
    "<b>" + user.full_name + "</b> {{modules.network.notification.tag_post}}"
  const link = "posts/" + post._id
  const body = compactContent(comment)
  await sendNotification(user?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(user?.id)
  })
}

const sendNotificationEndorsement = async (
  link,
  user,
  badget_name,
  receivers
) => {
  const title =
    "<b>" +
    user.full_name +
    "</b> {{modules.network.notification.has_endorsed_post}} " +
    badget_name
  const body = ""
  await sendNotification(user?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(user?.id)
  })
}

const sendNotificationEndorsementAll = async (
  link,
  endor_user,
  badget_name,
  receivers
) => {
  const title =
    "<b>" +
    endor_user.full_name +
    "</b> {{modules.network.notification.was_endorsed_post}} " +
    badget_name
  const body = ""
  await sendNotification(endor_user?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(endor_user?.id)
  })
}

const sendNotificationPostPendingFeed = async (post, post_owner, receivers) => {
  const title =
    "<b>" +
    post_owner.full_name +
    "</b> {{modules.network.notification.requested_approval_post}} "
  const body = compactContent(post.content)
  const link = "/feed/approve-post"
  await sendNotification(post_owner?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(post_owner?.id)
  })
}

const sendNotificationRepliedCommentPost = async (
  post,
  user,
  comment,
  receivers
) => {
  const title =
    "<b>" +
    user.full_name +
    "</b> {{modules.network.notification.replied_on_your_comment}}"
  const link = "posts/" + post._id
  const body = compactContent(comment)
  await sendNotification(user?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(user?.id)
  })
}
export {
  sendNotificationApproveJoin,
  sendNotificationApprovePost,
  sendNotificationPostPending,
  sendNotificationRequestJoin,
  sendNotificationUnseenPost,
  sendNotificationNewPost,
  sendNotificationReactionPost,
  sendNotificationReactionPostTag,
  sendNotificationCommentPost,
  sendNotificationCommentPostTag,
  sendNotificationTagInCommentPost,
  sendNotificationTagInPost,
  sendNotificationEndorsement,
  sendNotificationEndorsementAll,
  sendNotificationPostPendingFeed,
  sendNotificationRepliedCommentPost
}
