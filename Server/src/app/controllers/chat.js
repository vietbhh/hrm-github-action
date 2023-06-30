import { sendNotification } from "#app/libraries/notifications/Notifications.js"
import { getPublicDownloadUrl } from "#app/utility/common.js"
import admin from "firebase-admin"
import { getFirestore } from "firebase-admin/firestore"
import fs from "fs"
import { forEach, isEmpty } from "lodash-es"
import {
  handleAddNewGroupToFireStore,
  handleAddMemberToFireStoreGroup,
  handleRemoveMemberFromFireStoreGroup,
  handleDeleteFireStoreGroup
} from "#app/libraries/chat/Chat.js"
import { appInitial } from "#app/services/firebaseServices.js"

const db = getFirestore(appInitial)
const firestoreDb = process.env.FIRESTORE_DB
const imageGroup =
  process.env.SITEURL + "/assets/images/default_chat_group.webp"

/**
  @param:
  {
    group_name: string
    member: array,
    is_system: boolean
  }

  @returns: group_id
*/
const createGroup = async (req, res, next) => {
  try {
    const userId = req.userId.toString()
    if (!userId) {
      return res.fail("Not permission")
    }

    const body = req.body

    if (!body.group_name) {
      return res.fail("group_name not found")
    }
    if (!body.member) {
      return res.fail("member not found")
    }

    let is_system = false
    if (body.is_system === true) {
      is_system = true
    }

    const groupId = await handleAddNewGroupToFireStore(
      userId,
      body.group_name,
      body.member,
      is_system
    )
    return res.respond(groupId)
  } catch (err) {
    return res.fail(err.message)
  }
}

/**
  @param:
  {
    group_id: string
    member: array
  }

  @returns: success
*/
const addGroupMember = async (req, res, next) => {
  try {
    const userId = req.userId.toString()
    if (!userId) {
      return res.fail("Not permission")
    }

    const body = req.body

    if (!body.group_id) {
      return res.fail("group_id not found")
    }

    if (!body.member) {
      return res.fail("member not found")
    }

    await handleAddMemberToFireStoreGroup(userId, body.group_id, body.member)

    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}

/**
  @param:
  {
    group_id: string
    member: array
  }

  @returns: success
*/
const removeGroupMember = async (req, res, next) => {
  try {
    const userId = req.userId.toString()
    if (!userId) {
      return res.fail("Not permission")
    }

    const body = req.body

    if (!body.group_id) {
      return res.fail("group_id not found")
    }

    if (!body.member) {
      return res.fail("member not found")
    }

    await handleRemoveMemberFromFireStoreGroup(
      userId,
      body.group_id,
      body.member
    )

    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}

/**
  @param:
  {
    group_id: string
  }

  @returns: success
*/
const deleteGroup = async (req, res, next) => {
  try {
    const userId = req.userId.toString()
    if (!userId) {
      return res.fail("Not permission")
    }

    const body = req.body

    if (!body.group_id) {
      return res.fail("group_id not found")
    }

    await handleDeleteFireStoreGroup(userId, body.group_id)

    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}

/**
  @param:
  {
    group_id: string,
    message: string,
    sender_name: string
  }

  @returns: success
*/
const sendMessageGroup = async (req, res, next) => {
  try {
    const userId = req.userId.toString()
    if (!userId) {
      return res.fail("Not permission")
    }

    const body = req.body

    if (!body.group_id) {
      return res.fail("group_id not found")
    }

    if (!body.message) {
      return res.fail("message not found")
    }

    if (!body.sender_name) {
      return res.fail("sender_name not found")
    }

    const group_id = body.group_id
    const refGroup = db
      .collection(`${firestoreDb}/chat_groups/groups`)
      .doc(group_id)
    const docGroup = await refGroup.get()
    if (!docGroup.exists) {
      return res.fail("No such document group")
    }

    const dataGroup = docGroup.data()
    if (dataGroup.user.indexOf(userId) === -1) {
      return res.fail("Not permission")
    }

    const msg = body.message
    const timestamp = Date.now()
    const docData = {
      message: msg,
      sender_id: userId,
      timestamp: timestamp,
      type: "text",
      break_type: "line_time",
      timestamp_link: 0,
      timestamp_image: 0,
      timestamp_file: 0,
      _smeta: triGram(msg)
    }
    await db.collection(`${firestoreDb}/chat_messages/${group_id}`).add(docData)

    // ** notification
    const mute = dataGroup.mute.filter((item) => item !== userId)
    const unseen = dataGroup.user
    const index = unseen.indexOf(userId)
    if (index !== -1) {
      unseen.splice(index, 1)
    }
    const receivers = mute
      .filter((x) => !unseen.includes(x))
      .concat(unseen.filter((x) => !mute.includes(x)))
    if (!isEmpty(receivers)) {
      let _msg = replaceHtmlMessage(msg)
      const fullNameSplit = body.sender_name.split(" ")
      const fullNameSplitGroupMsg = fullNameSplit[fullNameSplit.length - 1]
      const dot = msg.length > 25 ? "..." : ""
      _msg = _msg.slice(0, 25) + dot
      _msg = fullNameSplitGroupMsg + ": " + _msg
      const link = `/chat/${group_id}`
      const icon = dataGroup.avatar
        ? getPublicDownloadUrl(
            `modules/chat/${group_id}/avatar/${dataGroup.avatar}`
          )
        : imageGroup
      const skipUrls = `/chat`
      sendNotification(
        userId,
        receivers,
        {
          title: body.sender_name,
          body: _msg,
          link: link,
          icon: icon
          //image: getPublicDownloadUrl("modules/chat/1_1658109624_avatar.webp")
        },
        {
          skipUrls: skipUrls
        }
      )
    }

    // ** update group
    const unseen_detail = []
    forEach(dataGroup.unseen_detail, (item) => {
      if (userId === item.user_id) {
        unseen_detail.push({
          user_id: item.user_id,
          timestamp_from: 0,
          timestamp_to: 0,
          unread_count: 0
        })
      } else {
        let timestamp_from = 0
        let timestamp_to = 0
        let unread_count = 0
        if (item.unread_count === 0) {
          timestamp_from = timestamp
          timestamp_to = timestamp
          unread_count = 1
        } else {
          timestamp_from = item.timestamp_from
          timestamp_to = timestamp
          unread_count = item.unread_count + 1
        }
        unseen_detail.push({
          user_id: item.user_id,
          timestamp_from: timestamp_from,
          timestamp_to: timestamp_to,
          unread_count: unread_count
        })
      }
    })
    const dataUpdateGroup = {
      last_message: msg,
      last_user: userId,
      timestamp: timestamp,
      new: 0,
      unseen: unseen,
      unseen_detail: unseen_detail
    }
    await handleUpdateGroup(group_id, dataUpdateGroup)

    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}

// ** support function
const handleUpdateGroup = async (groupId, dataUpdate) => {
  const ref = db.collection(`${firestoreDb}/chat_groups/groups`).doc(groupId)
  return await ref.update(dataUpdate)
}

const triGram = (txt) => {
  txt = txt.slice(0, 500)
  txt = replaceTextMessage(txt)
  const map = {}
  const s1 = (txt || "").toLowerCase()
  const n = 3
  for (let k = 0; k <= s1.length - n; k++) map[s1.substring(k, k + n)] = true

  return map
}

const replaceTextMessage = (txt) => {
  const mapObj = {
    "<br>": " "
  }
  txt = txt.replace(/<br>/gi, function (matched) {
    return mapObj[matched]
  })

  return txt
}

const replaceHtmlMessage = (txt) => {
  return txt.replace(/<[^>]*>/g, "")
}

export {
  createGroup,
  addGroupMember,
  removeGroupMember,
  deleteGroup,
  sendMessageGroup
}
