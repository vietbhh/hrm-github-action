import { getFirestore } from "firebase-admin/firestore"
import fs from "fs"
import admin from "firebase-admin"
import { forEach } from "lodash-es"
import { appInitial } from "#app/services/firebaseServices.js"

const db = getFirestore(appInitial)
const firestoreDb = process.env.FIRESTORE_DB

const handleAddNewGroupToFireStore = async (
  userId,
  groupName,
  arrMember,
  isSystem
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
    admin: [userId],
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

const handleAddMemberToFireStoreGroup = async (userId, groupId, arrMember) => {
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
    .doc(group_id)
  const docGroup = await refGroup.get()
  if (!docGroup.exists) {
    throw new Error("No such document group")
  }

  const dataGroup = docGroup.data()
  if (dataGroup.user.indexOf(userId) === -1) {
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

  return "success"
}

const handleRemoveMemberFromFireStoreGroup = async (
  userId,
  groupId,
  arrMember
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
    .doc(group_id)
  const docGroup = await refGroup.get()
  if (!docGroup.exists) {
    throw new Error("No such document group")
  }

  const dataGroup = docGroup.data()
  if (dataGroup.admin.indexOf(userId) === -1) {
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

  await handleUpdateGroup(group_id, docData)

  return "success"
}

const handleDeleteFireStoreGroup = async (userId, group_id) => {
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
  handleDeleteFireStoreGroup
}
