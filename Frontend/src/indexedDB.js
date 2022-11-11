import { openDB } from "idb"

export const createIndexedDB = async () => {
  await openDB("friday-storage", 1, {
    upgrade(db) {
      db.createObjectStore("notifications", {
        autoIncrement: true
      })
    }
  })
}

export const addNotification = async (data) => {
  const db = await openDB("friday-storage", 1)
  const tx = db.transaction("notifications", "readwrite")
  return await Promise.all(
    data.map((item) => {
      tx.store.add({
        ...item
      })
    })
  )
}

export const clearNotification = async () => {
  const db = await openDB("friday-storage", 1)

  return await db.clear("notifications")
}

export const getNotification = async () => {
  const db = await openDB("friday-storage", 1)
  const listNotification = await db.getAll("notifications")

  return listNotification
}

export const getNumberNewNotification = (notifications = false) => {
  const listNotification = !notifications ? getNotification() : notifications
  let number = 0
  listNotification.map((item) => {
    if (!item.seen || item.seen === "false") {
      number++
    }
  })

  return number
}

export const recrateNotificationData = (data) => {
  clearNotification()
    .then(addNotification(data))
    .catch((err) => {
      console.log(err)
    })
}

export const updateNotification = (data) => {}
