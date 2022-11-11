// ** React Imports
import { Fragment } from "react"
import moment from "moment"
import { onMessageListener } from "firebase"
import { addNotification } from "indexedDB"
// ** redux
import { useSelector, useDispatch } from "react-redux"
import { handleNotification } from "redux/notification"
// ** Styles
// ** Components
import notification from "@apps/utility/notification"

const Notification = (props) => {
  const notificationStore = useSelector((state) => state.notification)
  const listNotificationStore = notificationStore.listNotification
  const numberNotificationStore = notificationStore.numberNotification
  const dispatch = useDispatch()

  // ** handle
  const renderImage = (payload) => {
    if (payload.notification.image !== undefined) {
      return (
        <div className="w-25">
          <div className="d-flex align-items-center div-notification">
            <div className="div-img">
              <img src={payload.notification.image} className="img" />
            </div>
          </div>
        </div>
      )
    }

    return ""
  }

  const renderNotificationBody = (payload) => {
    return (
      <div className="d-flex">
        <Fragment>{renderImage(payload)}</Fragment>
        <div className="pt-1">
          <p className="mb-0 ms-50">{payload.notification.body}</p>
        </div>
      </div>
    )
  }

  onMessageListener()
    .then((payload) => {
      notification.show({
        title: payload.notification.title,
        text: renderNotificationBody(payload),
        meta: moment().format("D MMM YYYY, h:mm:ss a")
      })

      const notificationData = payload?.data
      if (notificationData?.add_notification === "true") {
        const listNotification = [
          { ...JSON.parse(notificationData.notification_info) },
          ...listNotificationStore
        ]
        const numberNotification = parseInt(numberNotificationStore) + 1
        dispatch(
          handleNotification({
            listNotification,
            numberNotification
          })
        )
      }
    })
    .catch((err) => {
      console.log(err)
    })

  navigator.serviceWorker.addEventListener("message", function (event) {
    const notificationInfo = event.data
    const listNotification = [{ ...notificationInfo }, ...listNotificationStore]
    const numberNotification = parseInt(numberNotificationStore) + 1
    dispatch(
      handleNotification({
        listNotification,
        numberNotification
      })
    )
  })

  return ""
}

export default Notification
