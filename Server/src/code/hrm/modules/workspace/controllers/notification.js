import { sendNotification } from "#app/libraries/notifications/Notifications.js"
import { getUser } from "#app/models/users.mysql.js"
import { Op, Sequelize } from "sequelize"
import workspaceMongoModel from "../models/workspace.mongo.js"
import { notificationsModelMysql } from "#app/models/notifications.mysql.js"
import commentMongoModel from "../../feed/models/comment.mongo.js"

const compactContent = (content = "") => {
  const contentPost = content
  let body = contentPost.replace(/<[^>]+>/g, "")
  body = body.replace(/\u00a0/g, "")

  if (body.length > 80) {
    body = body.substring(0, 80) + "..."
  }

  return body
}

const handleJsonQueryString = (column, key, value) => {
  const query = "JSON_EXTRACT(" + column + ",'$." + key + "') = '" + value + "'"
  return query
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
  let title =
    "<b>" +
    userReaction.full_name +
    "</b> " +
    reaction +
    " {{modules.network.notification.reaction_post}}"

  const link = "posts/" + post._id
  const body = compactContent(post.content)

  let update_notification = false

  const infoNotification = await notificationsModelMysql.findOne({
    where: {
      [Op.and]: [
        Sequelize.literal(
          handleJsonQueryString("custom_fields", "source_id", post._id)
        ),
        Sequelize.literal(
          handleJsonQueryString("custom_fields", "source_type", "reaction_post")
        )
      ]
    }
  })
  //handleJsonQueryString
  if (infoNotification) {
    update_notification = true
    const reactionPost = post.reaction
    let numberReaction = 0
    reactionPost.map((reaction) => {
      const count = reaction.react_user.length
      numberReaction += count
    })
    if (numberReaction > 0) {
      title =
        "<b>" +
        userReaction.full_name +
        "</b> to " +
        reaction +
        " and " +
        numberReaction +
        " {{modules.network.notification.other_reaction_post}}"
    }
  }

  await sendNotification(userReaction?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(userReaction?.id),
    custom_fields: { source_id: post._id, source_type: "reaction_post" },
    update_notification: update_notification,
    idUpdate: infoNotification?.id
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
  let update_notification = false
  const infoNotification = await notificationsModelMysql.findOne({
    where: {
      [Op.and]: [
        Sequelize.literal(
          handleJsonQueryString("custom_fields", "source_id", post._id)
        ),
        Sequelize.literal(
          handleJsonQueryString(
            "custom_fields",
            "source_type",
            "reaction_post_tag"
          )
        )
      ]
    }
  })
  if (infoNotification) {
    update_notification = true
    const reactionPost = post.reaction
    let numberReaction = 0
    reactionPost.map((reaction) => {
      const count = reaction.react_user.length
      numberReaction += count
    })
    title =
      "<b>" +
      userReaction.full_name +
      "</b> to " +
      reaction +
      " and " +
      (numberReaction - 1) +
      " of other people who have interacted post you're tagged"
  }

  await sendNotification(userReaction?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(userReaction?.id),
    custom_fields: { source_id: post._id, source_type: "reaction_post_tag" },
    update_notification: update_notification,
    idUpdate: infoNotification?.id
  })
}
const sendNotificationCommentPost = async (post, user, comment, receivers) => {
  let title =
    "<b>" +
    user.full_name +
    "</b> {{modules.network.notification.commented_on_your_post}}"
  const link = "posts/" + post._id
  const body = compactContent(comment)

  let update_notification = false
  const infoNotification = await notificationsModelMysql.findOne({
    where: {
      [Op.and]: [
        Sequelize.literal(
          handleJsonQueryString("custom_fields", "source_id", post._id)
        ),
        Sequelize.literal(
          handleJsonQueryString("custom_fields", "source_type", "comment_post")
        )
      ]
    }
  })
  if (infoNotification) {
    const data_comment = await commentMongoModel.find({
      post_id: { $in: post._id }
    })
    const arrCmt = data_comment.map((x) => x.created_by)
    const checkExist = [...new Set(arrCmt)]
    update_notification = true

    if (checkExist.length > 1) {
      title =
        "<b>" +
        user.full_name +
        "</b> and " +
        (checkExist.length - 1) +
        " of other people who have comment your post"
    }
  }

  await sendNotification(user?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(user?.id),
    custom_fields: { source_id: post._id, source_type: "comment_post" },
    update_notification: update_notification,
    idUpdate: infoNotification?.id
  })
}

const sendNotificationCommentPostTag = async (
  post,
  userReaction,
  comment,
  receivers
) => {
  let title =
    "<b>" +
    userReaction.full_name +
    "</b> {{modules.network.notification.comment_post_tag}}"
  const link = "posts/" + post._id
  const body = compactContent(comment)

  let update_notification = false
  const infoNotification = await notificationsModelMysql.findOne({
    where: {
      [Op.and]: [
        Sequelize.literal(
          handleJsonQueryString("custom_fields", "source_id", post._id)
        ),
        Sequelize.literal(
          handleJsonQueryString(
            "custom_fields",
            "source_type",
            "comment_post_tag"
          )
        )
      ]
    }
  })
  if (infoNotification) {
    const data_comment = await commentMongoModel.find({
      post_id: { $in: post._id }
    })
    const arrCmt = data_comment.map((x) => x.created_by)
    const checkExist = [...new Set(arrCmt)]

    update_notification = true
    if (checkExist.length > 1) {
      title =
        "<b>" +
        userReaction.full_name +
        "</b> and " +
        (checkExist.length - 1) +
        " of other people who have comment post you're tagged"
    }
  }

  await sendNotification(userReaction?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(userReaction?.id),
    custom_fields: { source_id: post._id, source_type: "comment_post_tag" },
    update_notification: update_notification,
    idUpdate: infoNotification?.id
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
  let title =
    "<b>" +
    user.full_name +
    "</b> {{modules.network.notification.replied_on_your_comment}}"
  const link = "posts/" + post.post_id
  const body = compactContent(comment)

  let update_notification = false
  const infoNotification = await notificationsModelMysql.findOne({
    where: {
      [Op.and]: [
        Sequelize.literal(
          handleJsonQueryString("custom_fields", "source_id", post._id)
        ),
        Sequelize.literal(
          handleJsonQueryString(
            "custom_fields",
            "source_type",
            "replied_comment_post"
          )
        )
      ]
    }
  })
  if (infoNotification) {
    update_notification = true
    let sub_comment = post.sub_comment
    let userComment = []
    sub_comment.map((item) => {
      if (
        !userComment.includes(item?.created_by) &&
        item?.created_by !== post.created_by
      ) {
        userComment.push(item?.created_by)
      }
    })
    title =
      "<b>" +
      user.full_name +
      "</b> and " +
      (userComment.length - 1) +
      " of other people who have replied your comment"
  }
  await sendNotification(user?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(user?.id),
    custom_fields: { source_id: post._id, source_type: "replied_comment_post" },
    update_notification: update_notification,
    idUpdate: infoNotification?.id
  })
}

const sendNotificationReactionCommentPost = async (
  post,
  userReaction,
  reaction,
  receivers
) => {
  let title =
    "<b>" +
    userReaction.full_name +
    "</b> " +
    reaction +
    " {{modules.network.notification.your_comment_post}}"

  const link = "posts/" + post.post_id
  const body = compactContent(post.content)

  let update_notification = false
  const infoNotification = await notificationsModelMysql.findOne({
    where: {
      [Op.and]: [
        Sequelize.literal(
          handleJsonQueryString("custom_fields", "source_id", post._id)
        ),
        Sequelize.literal(
          handleJsonQueryString(
            "custom_fields",
            "source_type",
            "reaction_comment_post"
          )
        )
      ]
    }
  })
  //handleJsonQueryString
  if (infoNotification) {
    update_notification = true
    const reactionPost = post.reaction
    let numberReaction = 0
    reactionPost.map((reaction) => {
      const count = reaction.react_user.length
      numberReaction += count
    })
    title =
      "<b>" +
      userReaction.full_name +
      "</b> to " +
      reaction +
      " and " +
      numberReaction +
      " of other people who have interacted with your comment"
  }
  await sendNotification(userReaction?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(userReaction?.id),
    custom_fields: {
      source_id: post._id,
      source_type: "reaction_comment_post"
    },
    update_notification: update_notification,
    idUpdate: infoNotification?.id
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
  const title =
    "You have been added to the group <b>" +
    workgroup?.name +
    "</b> by <b>" +
    sender?.full_name +
    "</b>"
  const link = "workspace/" + workgroup.id
  await sendNotification(sender?.id, receivers, {
    title: "",
    body: title,
    link: link,
    icon: parseInt(sender?.id)
  })
}

const sendNotificationHasNewMember = async (
  workgroup,
  member,
  receiversAdmin,
  sender
) => {
  let title = ""
  const receivers = [...receiversAdmin]
  const memberFullname = member[0].full_name
  if (member.length <= 1) {
    title =
      "<b>" +
      memberFullname +
      "</b> has joined the group <b>" +
      workgroup?.name +
      "</b>"
  } else {
    title =
      "<b>" +
      memberFullname +
      "</b> and " +
      (member.length - 1) +
      " others has joined the group <b>" +
      workgroup?.name +
      "</b>"
  }
  const link = "workspace/" + workgroup.id + "/member"
  await sendNotification(sender?.id, receivers, {
    title: "",
    body: title,
    link: link,
    icon: ""
  })
}

const sendNotificationAddMemberWaitApproval = async (
  workgroup,
  sender,
  receivers
) => {
  const title =
    "<b>" +
    sender?.full_name +
    "</b> has added you to the group <b>" +
    sender?.full_name +
    "</b>. Please wait for the administrator's approval"
  const link = "workspace/" + workgroup.id
  await sendNotification(sender?.id, receivers, {
    title: "",
    body: title,
    link: link,
    icon: parseInt(sender?.id)
  })
}
const sendNotificationAssignedAdmin = async (workgroup, sender, receivers) => {
  const title =
    "<b>" +
    sender.full_name +
    "</b> added you as admin of group <b>" +
    workgroup?.name +
    "</b>"
  const link = "workspace/" + workgroup.id
  await sendNotification(sender?.id, receivers, {
    title: "",
    body: title,
    link: link,
    icon: parseInt(sender?.id)
  })
}

const sendNotificationKickMember = async (workgroup, sender, receivers) => {
  const title =
    "<b>" +
    sender.full_name +
    "</b> has removed you from the group <b>" +
    workgroup?.name +
    "</b>"
  const link = "workgroup/" + workgroup.id
  await sendNotification(sender?.id, receivers, {
    title: "",
    body: title,
    link: link,
    icon: parseInt(sender?.id)
  })
}

const sendNotificationCommentImagePost = async (
  post,
  user,
  comment,
  receivers
) => {
  const type = post?.type
  let typePost = "{{modules.network.notification.commented_on_your_image}}"
  if (type === "video")
    typePost = "{{modules.network.notification.commented_on_your_video}}"
  let title = "<b>" + user.full_name + "</b> " + typePost
  const link = "posts/" + post._id + "/" + post._id
  const body = compactContent(comment)

  let update_notification = false
  const infoNotification = await notificationsModelMysql.findOne({
    where: {
      [Op.and]: [
        Sequelize.literal(
          handleJsonQueryString("custom_fields", "source_id", post._id)
        ),
        Sequelize.literal(
          handleJsonQueryString(
            "custom_fields",
            "source_type",
            "comment_post_" + type
          )
        )
      ]
    }
  })
  if (infoNotification) {
    const data_comment = await commentMongoModel.find({
      post_id: { $in: post._id }
    })
    const arrCmt = data_comment.map((x) => x.created_by)
    const checkExist = [...new Set(arrCmt)]
    update_notification = true

    if (checkExist.length > 1) {
      let typePost =
        " {{modules.network.notification.other_comment_on_your_image}}"
      if (type === "video")
        typePost =
          " {{modules.network.notification.other_comment_on_your_video}}"
      title =
        "<b>" +
        user.full_name +
        "</b> and " +
        (checkExist.length - 1) +
        typePost
    }
  }
  await sendNotification(user?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(user?.id),
    custom_fields: { source_id: post._id, source_type: "comment_post_" + type },
    update_notification: update_notification,
    idUpdate: infoNotification?.id
  })
}

const sendNotificationReactionImagePost = async (
  post,
  user,
  reaction,
  receivers
) => {
  const type = post?.type
  let typePost = " {{modules.network.notification.reaction_on_your_image}}"
  if (type === "video")
    typePost = " {{modules.network.notification.reaction_on_your_video}}"
  let title = "<b>" + user.full_name + "</b> " + reaction + typePost
  const link = "posts/" + post._id + "/" + post._id
  const body = compactContent(post.content)

  let update_notification = false
  const infoNotification = await notificationsModelMysql.findOne({
    where: {
      [Op.and]: [
        Sequelize.literal(
          handleJsonQueryString("custom_fields", "source_id", post._id)
        ),
        Sequelize.literal(
          handleJsonQueryString(
            "custom_fields",
            "source_type",
            "reaction_post_" + type
          )
        )
      ]
    }
  })
  if (infoNotification) {
    const reactionPost = post.reaction
    let numberReaction = 0
    reactionPost.map((reaction) => {
      const count = reaction.react_user.length
      numberReaction += count
    })

    update_notification = true
    if (numberReaction > 0) {
      let typePost =
        " {{modules.network.notification.other_reaction_on_your_image}}"
      if (type === "video")
        typePost =
          " {{modules.network.notification.other_reaction_on_your_video}}"
      title =
        "<b>" +
        user.full_name +
        "</b> " +
        reaction +
        " and " +
        numberReaction +
        typePost
    }
  }
  await sendNotification(user?.id, receivers, {
    title: title,
    body: body,
    link: link,
    icon: parseInt(user?.id),
    custom_fields: {
      source_id: post._id,
      source_type: "reaction_post_" + type
    },
    update_notification: update_notification,
    idUpdate: infoNotification?.id
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
  sendNotificationRepliedCommentPost,
  sendNotificationReactionCommentPost,
  sendCommonWorkgroupNotification,
  sendNotificationAddMember,
  sendNotificationHasNewMember,
  sendNotificationAddMemberWaitApproval,
  sendNotificationAssignedAdmin,
  sendNotificationKickMember,
  sendNotificationCommentImagePost,
  sendNotificationReactionImagePost
}
