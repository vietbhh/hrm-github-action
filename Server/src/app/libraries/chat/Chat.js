import { getFirestore } from "firebase-admin/firestore"
import fs from "fs"
import admin from "firebase-admin"
import { forEach } from "lodash-es"
import { appInitial } from "#app/services/firebaseServices.js"
import { getUsers } from "#app/models/users.mysql.js"

const db = getFirestore(appInitial)
const firestoreDb = process.env.FIRESTORE_DB

const handleAddNewGroupToFireStore = async (
  userId,
  groupName,
  arrMember,
  isSystem = false,
  arrAdmin = []
) => {
  if (!userId) {
    throw new Error("Not permission")
  }

  if (!groupName) {
    throw new Error("group_name not found")
  }

  if (!arrMember) {
    throw new Error("member not found")
  }

  const member = []
  const unseen = []
  forEach(arrMember, (item) => {
    const user = item.toString()
    member.push(user)
    unseen.push(user)
  })

  if (member.indexOf(userId) === -1) {
    member.push(userId)
  } else {
    unseen.splice(member.indexOf(userId), 1)
  }
  const timestamp = Date.now()
  const unseenDetail = []
  forEach(member, (item) => {
    if (userId === item) {
      unseenDetail.push({
        user_id: item,
        timestamp_from: 0,
        timestamp_to: 0,
        unread_count: 0
      })
    } else {
      unseenDetail.push({
        user_id: item,
        timestamp_from: timestamp,
        timestamp_to: timestamp,
        unread_count: 1
      })
    }
  })

  const docData = {
    last_message: "Create new group",
    last_user: userId,
    name: groupName,
    timestamp: timestamp,
    type: "group",
    user: member,
    admin: [...arrAdmin, userId],
    creator: userId,
    new: 0,
    unseen: unseen,
    unseen_detail: unseenDetail,
    des: "Never settle!",
    is_system: isSystem
  }

  return await handleAddNewGroup(docData).then((response) => {
    return response.id
  })
}

const handleAddMemberToFireStoreGroup = async (
  userId,
  groupId,
  arrMember,
  checkPermission = true
) => {
  if (!userId) {
    throw new Error("Not permission")
  }

  if (!groupId) {
    throw new Error("group_id not found")
  }

  if (!arrMember) {
    throw new Error("member not found")
  }

  const refGroup = db
    .collection(`${firestoreDb}/chat_groups/groups`)
    .doc(groupId)
  const docGroup = await refGroup.get()
  if (!docGroup.exists) {
    throw new Error("No such document group")
  }

  const dataGroup = docGroup.data()
  if (dataGroup.user.indexOf(userId) === -1 && checkPermission) {
    throw new Error("No permission")
  }

  const member = dataGroup.user
  const unseen = dataGroup.unseen
  const member_add = []
  forEach(arrMember, (item) => {
    const user = item.toString()
    if (member.indexOf(user) === -1) {
      member.push(user)
      unseen.push(user)
      member_add.push(user)
    }
  })
  const timestamp = Date.now()
  const _unseen_detail = [...dataGroup.unseen_detail]
  forEach(member_add, (item) => {
    _unseen_detail.push({
      user_id: item,
      timestamp_from: timestamp,
      timestamp_to: timestamp,
      unread_count: 1
    })
  })

  const docData = {
    last_message: "Add new member",
    last_user: userId,
    timestamp: timestamp,
    user: member,
    unseen: unseen,
    unseen_detail: _unseen_detail
  }

  await handleUpdateGroup(groupId, docData)

  const listNewMemberInfo = await getUsers(arrMember)
  const arrNameNewMember = listNewMemberInfo.map((item) => {
    return item?.full_name
  })
  
  await handleSendMessageGroup(
    userId.toString(),
    groupId,
    arrNameNewMember.join(", ") + " has joined the chat",
    "",
    false,
    "notification"
  )

  return "success"
}

const handleRemoveMemberFromFireStoreGroup = async (
  userId,
  groupId,
  arrMember,
  checkPermission = true
) => {
  if (!userId) {
    throw new Error("Not permission")
  }

  if (!groupId) {
    throw new Error("group_id not found")
  }

  if (!arrMember) {
    throw new Error("member not found")
  }

  const refGroup = db
    .collection(`${firestoreDb}/chat_groups/groups`)
    .doc(groupId)
  const docGroup = await refGroup.get()
  if (!docGroup.exists) {
    throw new Error("No such document group")
  }

  const dataGroup = docGroup.data()
  if (dataGroup.admin.indexOf(userId) === -1 && checkPermission) {
    throw new Error("You are not an administrator")
  }

  const member_arr = []
  forEach(arrMember, (item) => {
    const user_id = item.toString()
    member_arr.push(user_id)
  })
  const user = dataGroup.user.filter((x) => !member_arr.includes(x))
  const unseen = dataGroup.unseen.filter((x) => !member_arr.includes(x))
  const admin = dataGroup.admin.filter((x) => !member_arr.includes(x))
  const mute = dataGroup.mute.filter((x) => !member_arr.includes(x))
  const pin = dataGroup.pin.filter((x) => !member_arr.includes(x))

  const timestamp = Date.now()
  const _unseen_detail = [...dataGroup.unseen_detail]
  const unseen_detail = _unseen_detail.filter((item) => {
    if (member_arr.indexOf(item.user_id) !== -1) {
      return true
    }

    return false
  })

  const docData = {
    last_message: "Remove member",
    last_user: userId,
    timestamp: timestamp,
    user: user,
    unseen: unseen,
    admin: admin,
    mute: mute,
    pin: pin,
    unseen_detail: unseen_detail
  }

  await handleUpdateGroup(groupId, docData)

  const listNewMemberInfo = await getUsers(arrMember)
  const arrNameNewMember = listNewMemberInfo.map((item) => {
    return item.full_name
  })

  await handleSendMessageGroup(
    userId.toString(),
    groupId,
    arrNameNewMember.join(", ") + " has left the chat",
    "",
    false,
    "notification"
  )

  return "success"
}

const handleDeleteFireStoreGroup = async (userId, group_id) => {
  if (!userId) {
    throw new Error("Not permission")
  }

  if (!group_id) {
    throw new Error("group_id not found")
  }

  const refGroup = db
    .collection(`${firestoreDb}/chat_groups/groups`)
    .doc(group_id)
  const docGroup = await refGroup.get()
  if (!docGroup.exists) {
    throw new Error("No such document group")
  }

  const dataGroup = docGroup.data()
  if (dataGroup.admin.indexOf(userId) === -1) {
    throw new Error("You are not an administrator")
  }

  await handleDeleteGroup(group_id)
  return "success"
}

const handleSendMessageGroup = async (
  userId,
  group_id,
  message,
  sender_name,
  sendNotification = true,
  type = "text"
) => {
  if (!userId) {
    throw new Error("Not permission")
  }
  if (!group_id) {
    throw new Error("group_id not found")
  }

  if (!message) {
    throw new Error("message not found")
  }

  if (!sender_name && sendNotification) {
    throw new Error("sender_name not found")
  }

  const refGroup = db
    .collection(`${firestoreDb}/chat_groups/groups`)
    .doc(group_id)
  const docGroup = await refGroup.get()
  if (!docGroup.exists) {
    throw new Error("No such document group")
  }

  const dataGroup = docGroup.data()
  if (dataGroup.user.indexOf(userId) === -1) {
    throw new Error("Not permission")
  }

  const msg = message
  const timestamp = Date.now()
  const docData = {
    message: msg,
    sender_id: userId,
    timestamp: timestamp,
    type: type,
    break_type: "line_time",
    timestamp_link: 0,
    timestamp_media: 0,
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
  if (sendNotification) {
    const receivers = mute
      .filter((x) => !unseen.includes(x))
      .concat(unseen.filter((x) => !mute.includes(x)))
    if (!isEmpty(receivers)) {
      let _msg = replaceHtmlMessage(msg)
      const fullNameSplit = sender_name.split(" ")
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
          title: sender_name,
          body: _msg,
          link: link,
          icon: icon
        },
        {
          skipUrls: skipUrls
        }
      )
    }
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

  return "success"
}

// ** support function
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

const handleAddNewGroup = async (docData) => {
  docData = {
    mute: [],
    pin: [],
    avatar: "",
    background: "",
    file_count: {},
    des: "",
    ...docData
  }

  return await db.collection(`${firestoreDb}/chat_groups/groups`).add(docData)
}

const handleUpdateGroup = async (groupId, dataUpdate) => {
  const ref = db.collection(`${firestoreDb}/chat_groups/groups`).doc(groupId)
  return await ref.update(dataUpdate)
}

const handleDeleteGroup = async (groupId) => {
  return await db
    .collection(`${firestoreDb}/chat_groups/groups`)
    .doc(groupId)
    .delete()
}

export {
  handleAddNewGroupToFireStore,
  handleAddMemberToFireStoreGroup,
  handleRemoveMemberFromFireStoreGroup,
  handleDeleteFireStoreGroup,
  handleSendMessageGroup
}
