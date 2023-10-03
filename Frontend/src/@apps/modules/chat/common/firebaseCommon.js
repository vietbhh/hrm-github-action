import { getPublicDownloadUrl, useFormatMessage } from "@apps/utility/common"
import { db } from "@/firebase"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore"
import moment from "moment"
import { imageGroup, replaceHtmlMessage, triGram } from "./common"
import { AES } from "crypto-js"

const firestoreDb = import.meta.env.VITE_APP_FIRESTORE_DB
const keyEncrypt = "Friday"

const handleCountFile = (groups, groupId, type, action = "plus") => {
  let file_count = {}
  if (!_.isEmpty(groups)) {
    const index_groups = groups.findIndex((item) => item.id === groupId)
    if (index_groups !== -1) {
      const group_file_count = groups[index_groups]?.file_count || {}
      if (type === "link") {
        const count_link = group_file_count?.link
          ? action === "plus"
            ? group_file_count?.link + 1
            : group_file_count?.link - 1
          : 1
        file_count = { ...group_file_count, link: count_link }
      } else if (type === "image" || type === "image_gif") {
        const count_image = group_file_count?.image
          ? action === "plus"
            ? group_file_count?.image + 1
            : group_file_count?.image - 1
          : 1
        file_count = { ...group_file_count, image: count_image }
      } else if (type === "file" || type === "audio" || type === "video") {
        const count_file = group_file_count?.file
          ? action === "plus"
            ? group_file_count?.file + 1
            : group_file_count?.file - 1
          : 1
        file_count = { ...group_file_count, file: count_file }
      }
    }
  }

  return file_count
}

const handleBreakType = async (groupId, timestamp, data, chats, userId) => {
  const calculate_time_break = (timestamp, pre_timestamp, senderId) => {
    let break_type = ""
    const minute_diff = moment(timestamp).diff(moment(pre_timestamp), "minutes")

    if (0 < minute_diff && minute_diff < 20) {
      if (senderId === userId) {
        break_type = "minute"
      }
    } else if (minute_diff >= 20) {
      break_type = "line_time"
    }

    return break_type
  }

  let break_type = ""
  // ** check forward
  if (data.forward && !_.isEmpty(data.forward)) {
    if (groupId === "") {
      break_type = "line_time"
    } else {
      const q = query(
        collection(db, `${firestoreDb}/chat_messages/${groupId}`),
        orderBy("timestamp", "desc"),
        limit(1)
      )
      await getDocs(q).then((res) => {
        let dem = 0
        res.forEach((docData) => {
          dem++
          if (dem === 1) {
            const data_message = docData.data()
            const pre_timestamp = data_message.timestamp
            const senderId = data_message.sender_id
            break_type = calculate_time_break(
              timestamp,
              pre_timestamp,
              senderId
            )
          }
        })
        if (dem === 0) {
          break_type = "line_time"
        }
      })
    }
  } else {
    if (!_.isEmpty(chats)) {
      const _chat = chats[chats.length - 1]
      const pre_timestamp = _chat.time
      const senderId = _chat.senderId
      break_type = calculate_time_break(timestamp, pre_timestamp, senderId)
    } else {
      break_type = "line_time"
    }
  }

  return break_type
}

const handleTimestampFile = (data) => {
  let timestamp_link = 0
  let timestamp_image = 0
  let timestamp_file = 0
  if (data.status && (data.status === "loading" || data.status === "error")) {
    return { timestamp_link, timestamp_image, timestamp_file }
  }

  if (data.type === "link") {
    timestamp_link = data.timestamp
  }
  if (data.type === "image" || data.type === "image_gif") {
    timestamp_image = data.timestamp
  }
  if (data.type === "file" || data.type === "video" || data.type === "audio") {
    timestamp_file = data.timestamp
  }

  return { timestamp_link, timestamp_image, timestamp_file }
}

const handleSendNotification = (
  socket,
  groupId,
  msg,
  dataGroups,
  receivers,
  userId,
  userFullName
) => {
  let notification_name = dataGroups.name
  let icon = dataGroups.avatar
    ? getPublicDownloadUrl(
        `modules/chat/${groupId}/avatar/${dataGroups.avatar}`
      )
    : imageGroup
  const link = `/chat/${groupId}`
  const skipUrls = `/chat`
  if (dataGroups.type === "employee") {
    icon = userId * 1
    notification_name = userFullName
  }
  let _msg = replaceHtmlMessage(msg)

  if (dataGroups.type === "group") {
    const fullNameSplit = userFullName.split(" ")
    const fullNameSplitGroupMsg = fullNameSplit[fullNameSplit.length - 1]
    const dot = msg.length > 25 ? "..." : ""
    _msg = _msg.slice(0, 25) + dot
    _msg = fullNameSplitGroupMsg + ": " + _msg
  } else {
    const dot = msg.length > 30 ? "..." : ""
    _msg = _msg.slice(0, 30) + dot
  }
  socket.emit("chat_notification", {
    receivers: receivers,
    payload: {
      title: notification_name,
      body: _msg,
      link: link,
      icon: icon
      //image: getPublicDownloadUrl("modules/chat/1_1658109624_avatar.webp")
    },
    data: {
      skipUrls: skipUrls
    }
  })
}

const handleLastMessage = (type, msg) => {
  let last_message = msg
  if (type === "image" || type === "image_gif") {
    last_message = useFormatMessage("modules.chat.text.send") + " image"
  } else if (type === "video") {
    last_message = useFormatMessage("modules.chat.text.send") + " video"
  } else if (type === "audio") {
    last_message = useFormatMessage("modules.chat.text.send") + " audio"
  } else if (type === "file") {
    last_message = useFormatMessage("modules.chat.text.send") + " file"
  } else if (type === "gif") {
    last_message = useFormatMessage("modules.chat.text.send") + " gif"
  }

  return last_message
}

const setDataUnseenDetail = (
  action,
  user_id,
  timestamp,
  unseen_detail,
  user,
  member_add = [],
  member_remove = ""
) => {
  if (action === "add") {
    const _unseen_detail = []
    _.forEach(user, (item) => {
      if (user_id === item) {
        _unseen_detail.push({
          user_id: item,
          timestamp_from: 0,
          timestamp_to: 0,
          unread_count: 0
        })
      } else {
        _unseen_detail.push({
          user_id: item,
          timestamp_from: timestamp,
          timestamp_to: timestamp,
          unread_count: 1
        })
      }
    })

    return _unseen_detail
  }

  if (action === "update") {
    const _unseen_detail = []
    _.forEach(unseen_detail, (item) => {
      console.log(typeof user_id)
      console.log(typeof item.user_id)
      if (user_id === item.user_id) {
        _unseen_detail.push({
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
        _unseen_detail.push({
          user_id: item.user_id,
          timestamp_from: timestamp_from,
          timestamp_to: timestamp_to,
          unread_count: unread_count
        })
      }
    })

    return _unseen_detail
  }

  if (action === "seen") {
    const _unseen_detail = []
    _.forEach(unseen_detail, (item) => {
      if (user_id === item.user_id) {
        _unseen_detail.push({
          user_id: item.user_id,
          timestamp_from: 0,
          timestamp_to: 0,
          unread_count: 0
        })
      } else {
        _unseen_detail.push(item)
      }
    })

    return _unseen_detail
  }

  if (action === "add_member") {
    const _unseen_detail = [...unseen_detail]
    _.forEach(member_add, (item) => {
      _unseen_detail.push({
        user_id: item,
        timestamp_from: timestamp,
        timestamp_to: timestamp,
        unread_count: 1
      })
    })

    return _unseen_detail
  }

  if (action === "delete_member") {
    const _unseen_detail = unseen_detail.filter(
      (item) => item.user_id !== member_remove
    )

    return _unseen_detail
  }

  return []
}

const handleUpdateGroup = async (groupId, dataUpdate) => {
  await updateDoc(
    doc(db, `${firestoreDb}/chat_groups/groups`, groupId),
    dataUpdate
  )
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
  return await addDoc(
    collection(db, `${firestoreDb}/chat_groups/groups`),
    docData
  )
}

const handleSendMessage = async (
  groupId = "",
  msg,
  dataAddFile = {},
  userId,
  userFullName,
  groups = [],
  _idEmployee,
  socket,
  chats = [],
  setCheckAddMessage,
  setLoadingMessage,
  setActive
) => {
  if (_.isFunction(setCheckAddMessage)) {
    setCheckAddMessage(true)
  }
  const timestamp = Date.now()
  const file_count = handleCountFile(groups, groupId, dataAddFile.type)
  const break_type = dataAddFile.break_type
    ? dataAddFile.break_type
    : await handleBreakType(groupId, timestamp, dataAddFile, chats, userId)

  // ** encrypt
  if (dataAddFile.message) {
    delete dataAddFile.message
  }
  const msg_not_encrypt = msg
  msg = AES.encrypt(msg, keyEncrypt).toString()
  dataAddFile = { ...dataAddFile, encrypt: 1 }

  if (groupId === "" && _idEmployee !== "") {
    const q = query(
      collection(db, `${firestoreDb}/chat_groups/groups`),
      where("user", "array-contains", _idEmployee),
      orderBy("timestamp", "desc")
    )

    await getDocs(q).then((res) => {
      res.forEach((docData) => {
        const dataGroup = docData.data()
        const idChat = docData.id
        if (
          dataGroup.user.length === 2 &&
          dataGroup.type === "employee" &&
          dataGroup.user.indexOf(userId) !== -1 &&
          dataGroup.user.indexOf(_idEmployee) !== -1
        ) {
          if (
            (dataGroup.user[0] === userId &&
              dataGroup.user[1] === _idEmployee) ||
            (dataGroup.user[1] === userId && dataGroup.user[0] === _idEmployee)
          ) {
            groupId = idChat
            return true
          }
        }
      })
    })
  }

  if (!_.isEmpty(groupId)) {
    delete dataAddFile.contact_id

    const docGroups = doc(db, `${firestoreDb}/chat_groups/groups`, groupId)
    getDoc(docGroups).then((res) => {
      const dataGroups = res.data()
      const unseen = dataGroups.user
      const index = unseen.indexOf(userId)
      if (index !== -1) {
        unseen.splice(index, 1)
      }
      const unseen_detail = dataGroups.unseen_detail

      const docData = {
        message: msg,
        sender_id: userId,
        timestamp: timestamp,
        type: "text",
        break_type: break_type,
        ...dataAddFile
      }
      if (docData.type === "text" || docData.type === "link") {
        docData["_smeta"] = triGram(msg_not_encrypt)
      }
      setDoc(doc(collection(db, `${firestoreDb}/chat_messages/${groupId}`)), {
        ...docData,
        ...handleTimestampFile(docData)
      })

      // ** notification
      const mute = dataGroups.mute.filter((item) => item !== userId)
      const receivers = mute
        .filter((x) => !unseen.includes(x))
        .concat(unseen.filter((x) => !mute.includes(x)))
      if (!_.isEmpty(dataAddFile.mention)) {
        _.forEach(dataAddFile.mention, (val_mention) => {
          if (!receivers.includes(val_mention) && val_mention !== userId) {
            receivers.push(val_mention)
          }
        })
      }
      if (!_.isEmpty(receivers)) {
        handleSendNotification(
          socket,
          groupId,
          handleLastMessage(docData.type, msg_not_encrypt),
          dataGroups,
          receivers,
          userId,
          userFullName
        )
      }

      let dataGroup = {
        last_message: handleLastMessage(docData.type, msg_not_encrypt),
        last_user: userId,
        timestamp: timestamp,
        new: 0,
        unseen: unseen,
        unseen_detail: setDataUnseenDetail(
          "update",
          userId,
          timestamp,
          unseen_detail,
          []
        )
      }
      if (!_.isEmpty(file_count)) {
        dataGroup = { ...dataGroup, file_count: file_count }
      }
      handleUpdateGroup(groupId, dataGroup)
    })
  } else {
    let idEmployee = _idEmployee
    let checkSetActive = true

    if (dataAddFile.forward) {
      if (
        !_.isUndefined(dataAddFile.contact_id) &&
        dataAddFile.contact_id !== ""
      ) {
        idEmployee = dataAddFile.contact_id
        delete dataAddFile.contact_id
        checkSetActive = false
      } else {
        return
      }
    }

    if (_.isFunction(setLoadingMessage)) {
      setLoadingMessage(true)
    }
    const type = dataAddFile.type ? dataAddFile.type : "text"
    let docData = {
      last_message: handleLastMessage(type, msg_not_encrypt),
      last_user: userId,
      name: "",
      timestamp: timestamp,
      type: "employee",
      user: [userId, idEmployee],
      new: 1,
      unseen: [idEmployee],
      unseen_detail: setDataUnseenDetail(
        "add",
        userId,
        timestamp,
        [],
        [userId, idEmployee]
      )
    }
    if (!_.isEmpty(file_count)) {
      docData = { ...docData, file_count: file_count }
    }
    handleAddNewGroup(docData).then((res) => {
      const newGroupId = res.id
      if (checkSetActive) {
        if (_.isFunction(setActive)) {
          setActive(newGroupId)
        }
      }
      const docDataMessage = {
        message: msg,
        sender_id: userId,
        timestamp: timestamp,
        type: "text",
        break_type: break_type,
        ...dataAddFile
      }
      if (docDataMessage.type === "text" || docDataMessage.type === "link") {
        docDataMessage["_smeta"] = triGram(msg_not_encrypt)
      }

      // ** notification
      handleSendNotification(
        socket,
        newGroupId,
        handleLastMessage(type, msg_not_encrypt),
        docData,
        idEmployee,
        userId,
        userFullName
      )

      setDoc(
        doc(collection(db, `${firestoreDb}/chat_messages/${newGroupId}`)),
        {
          ...docDataMessage,
          ...handleTimestampFile(docDataMessage)
        }
      )
      if (_.isFunction(setLoadingMessage)) {
        setLoadingMessage(false)
      }
    })
  }
}

export {
  handleCountFile,
  handleTimestampFile,
  setDataUnseenDetail,
  handleUpdateGroup,
  handleAddNewGroup,
  handleSendMessage
}
