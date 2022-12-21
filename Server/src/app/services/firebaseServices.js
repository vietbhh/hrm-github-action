import { initializeApp, cert } from "firebase-admin/app"
import { getMessaging } from "firebase-admin/messaging"

import path from "path"
initializeApp({
  credential: cert(path.join(global.__basedir, "service_account_file.json"))
})

export const sendMessage = (data,receiver) => {
  return getMessaging()
    .send(messages)
    .then((response) => {
      console.log(`Successfully sent notification`)
      console.log(response)
    })
    .catch((err) => {
      console.log("Notification could not be sent")
      console.log(err)
    })
}
