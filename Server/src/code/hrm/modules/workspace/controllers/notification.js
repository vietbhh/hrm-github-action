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

  let body =
    "{{modules.network.notification.request_to_join}} <strong>" +
    infoWorkspace?.name +
    "</strong> {{modules.network.notification.from}} <strong>" +
    memberInfo?.dataValues?.full_name +
    "</strong>"

  if (infoWorkspace.request_joins.length >= 2) {
    body =
      "{{modules.network.notification.requests_to_join}} <strong>" +
      infoWorkspace?.name +
      "</strong> {{modules.network.notification.from}} <strong>" +
      memberInfo?.dataValues?.full_name +
      " and " +
      (infoWorkspace.request_joins.length - 1) +
      " others"
    ;("</strong>")
  }

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
    "</strong> {{modules.network.notification.requested_approval_post_in_group}} <strong>" +
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
    icon: parseInt(userReaction?.id)
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

const sendCommonWorkgroupNotification = async (
  type,
  userInfo,
  workgroup,
  receivers
) => {
  let title = ""
  if (type === "send_to_users_added_by_admin") {
    title =
      "{{modules.workspace.text.notification.added_to_the_group}} <b>" +
      groupName +
      "</b> {{modules.workspace.text.notification.by}} <b>" +
      userInfo.full_name +
      "</b>"
  } else if (type === "send_to_users_added_by_member") {
    title =
      "<b>" +
      userInfo.full_name +
      "</b> {{modules.workspace.text.notification.added_you_to_the_group}} <b>" +
      workgroup.name +
      "</b>. {{modules.workspace.text.notification.wait_admin_approval}}"
  } else if (type === "send_to_admin_on_member_join_group") {
    title =
      "<b>" +
      userInfo.full_name +
      "</b> {{modules.workspace.text.notification.has_joined_group}}} <b>" +
      workgroup.name +
      "</b>"
  } else if (type === "send_to_member_assigned_admin_permission") {
    title =
      "<b>" +
      userInfo.full_name +
      "</b> {{modules.workspace.text.notification.has_joined_group}}} <b>" +
      workgroup.name +
      "</b>"
  } else if (type === "send_to_kicked_members") {
    title =
      "<b>" +
      userInfo.full_name +
      "</b> {{modules.workspace.text.notification.remove_from_group}}} <b>" +
      workgroup.name +
      "</b>"
  }

  await sendNotification(userInfo?.id, receivers, {
    title: title,
    body: "",
    link: "",
    icon: parseInt(userInfo?.id)
  })
}

const sendNotificationAddMember = async (workgroup, sender, receivers) => {
  console.log("sender", sender)
  const title =
    "You have been added to the group" +
    workgroup?.group_name +
    "by " +
    sender?.full_name
  const link = "workspace/" + workgroup._id
  await sendNotification(sender?.id, receivers, {
    title: title,
    body: "",
    link: link,
    icon: parseInt(sender?.id)
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
  sendCommonWorkgroupNotification,
  sendNotificationAddMember
}
