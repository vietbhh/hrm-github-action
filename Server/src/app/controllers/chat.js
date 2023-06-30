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
  handleDeleteFireStoreGroup,
  handleSendMessageGroup
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

    await handleSendMessageGroup(
      userId,
      body.group_id,
      body.message,
      body.sender_name
    )

    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}



export {
  createGroup,
  addGroupMember,
  removeGroupMember,
  deleteGroup,
  sendMessageGroup
}
