import { initializeApp, cert } from "firebase-admin/app"
import { getMessaging } from "firebase-admin/messaging"
import { isArray } from "lodash-es"

import path from "path"
initializeApp({
  credential: cert(path.join(global.__basedir, "service_account_file.json"))
})

export const sendNotification = (receiver, data) => {
  const sendKey = isArray(receiver) ? "tokens" : "token"
  const sendData = {
    data: {
      ...data,
      body: data.body + Math.floor(Math.random() * 1000)
    },
    [sendKey]: receiver
  }
  console.log(sendData)
  const sendApi = isArray(receiver)
    ? getMessaging().sendMulticast(sendData)
    : getMessaging().send(sendData)
  return sendApi
    .then((response) => {
      console.log(`Successfully sent notification`)
      console.log(response)
    })
    .catch((err) => {
      console.log("Notification could not be sent")
      console.log(err)
    })
}
