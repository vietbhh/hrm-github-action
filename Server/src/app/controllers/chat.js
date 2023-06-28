import admin from "firebase-admin"
import { getFirestore } from "firebase-admin/firestore"
import fs from "fs"
import { forEach } from "lodash-es"

const loadJSON = (path) =>
  JSON.parse(fs.readFileSync(new URL(path, import.meta.url)))
const serviceAccount = loadJSON("./serviceAccount.json")

const firebaseApp = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
      "https://friday-351410-default-rtdb.asia-southeast1.firebasedatabase.app"
  },
  "second_app"
)
const db = getFirestore(firebaseApp)
const firestoreDb = process.env.FIRESTORE_DB

const createGroup = async (req, res, next) => {
  try {
    const userId = req.userId
    const body = req.body
    const group_name = body.group_name
    const member = body.member
    let unseen = body.member
    if (!group_name) {
      return res.fail("group_name not found")
    }
    if (!group_name) {
      return res.fail("member not found")
    }

    if (member.indexOf(userId) === -1) {
      member.push(userId)
    } else {
      unseen.splice(member.indexOf(userId), 1)
    }
    const timestamp = Date.now()
    const unseen_detail = []
    forEach(member, (item) => {
      if (userId.toString() === item.toString()) {
        unseen_detail.push({
          user_id: item,
          timestamp_from: 0,
          timestamp_to: 0,
          unread_count: 0
        })
      } else {
        unseen_detail.push({
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
      name: group_name,
      timestamp: timestamp,
      type: "group",
      user: member,
      admin: [userId],
      creator: userId,
      new: 0,
      unseen: unseen,
      unseen_detail: unseen_detail,
      des: "Never settle!"
    }

    return await handleAddNewGroup(docData)
      .then((res) => {
        console.log(res.id)
        return res.respond(res.id)
      })
      .catch((err) => {
        return res.fail(err)
      })
  } catch (err) {
    return res.fail(err.message)
  }
}

const addGroupMember = async (req, res, next) => {
  try {
    return res.respond("data")
  } catch (err) {
    return res.fail(err.message)
  }
}

const removeGroupMember = async (req, res, next) => {
  try {
    return res.respond("data")
  } catch (err) {
    return res.fail(err.message)
  }
}

const deleteGroup = async (req, res, next) => {
  try {
    return res.respond("data")
  } catch (err) {
    return res.fail(err.message)
  }
}

const sendMessageGroup = async (req, res, next) => {
  try {
    return res.respond("data")
  } catch (err) {
    return res.fail(err.message)
  }
}

// ** support function
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

export {
  createGroup,
  addGroupMember,
  removeGroupMember,
  deleteGroup,
  sendMessageGroup
}
