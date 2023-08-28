import { getUser, getUsers, usersModel } from "#app/models/users.mysql.js"
import {
  getDefaultFridayLogo,
  handleFormatMessageStr,
  stripHTML
} from "#app/utility/common.js"
import { cert, initializeApp } from "firebase-admin/app"
import { getMessaging } from "firebase-admin/messaging"
import { forEach, isArray, isEmpty, map } from "lodash-es"
import path from "path"

export const appInitial = initializeApp({
  credential: cert(path.join(global.__basedir, "service_account_file.json"))
})
/**
 * View param
 * https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages
 * **/
export const sendFirebaseNotification = async (
  receivers,
  payload,
  data = {},
  overRideFirebaseConfig = {}
) => {
  let title = payload?.title
  let body = payload?.body
  const link = payload?.link ?? ""
  const icon = payload?.icon ?? getDefaultFridayLogo()
  const image = payload?.image
    ? {
        image: payload?.image
      }
    : {}
  const { webpush, ...restOverRideFirebaseConfig } = overRideFirebaseConfig
  let receiversTokens = [],
    receiversUserId = {}
  title = stripHTML(handleFormatMessageStr(title))
  body = stripHTML(handleFormatMessageStr(body))
  //Get user devive's token
  if (isArray(receivers)) {
    const users = await getUsers(receivers)
    forEach(users, (item) => {
      if (item?.device_token) {
        const userTokens = JSON.parse(item.device_token)
        receiversUserId[item.id] = userTokens
        receiversTokens = [...receiversTokens, ...userTokens]
      }
    })
  } else {
    const user = await getUser(receivers)
    if (user?.device_token) {
      const userTokens = JSON.parse(user.device_token)
      receiversUserId[user.id] = userTokens
      receiversTokens = userTokens
    }
  }

  //Handle notification data
  const notificationData = {
    title,
    body,
    ...image
  }

  const sendData = {
    notification: notificationData,
    data,
    webpush: {
      headers: {
        urgency: "high"
      },
      data,
      notification: {
        ...notificationData,
        icon
      },
      fcm_options: {
        link: link
      },
      ...webpush
    },
    tokens: receiversTokens,
    ...restOverRideFirebaseConfig
  }
  //if empty send nothing
  if (isEmpty(receiversTokens)) return true

  return getMessaging()
    .sendMulticast(sendData)
    .then((response) => {
      //Check fail token,remove token from user if token failed
      if (response.failureCount > 0) {
        const failedTokens = []
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(receiversTokens[idx])
          }
        })
        if (!isEmpty(failedTokens)) {
          map(receiversUserId, (tokensList, userId) => {
            const workingTokens = tokensList.filter(
              (val) => !failedTokens.includes(val)
            )
            if (tokensList.length !== workingTokens.length) {
              usersModel.update(
                {
                  device_token: workingTokens
                },
                {
                  where: {
                    id: userId
                  }
                }
              )
            }
          })
        }
      }
    })
    .catch((err) => {
      console.log("Notification could not be sent")
      console.log(err)
    })
}
