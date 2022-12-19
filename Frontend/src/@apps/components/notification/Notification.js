// ** React Imports
import { onMessageListener } from "firebase"
import moment from "moment"
import { Fragment, useContext, useEffect } from "react"
// ** redux
import { useDispatch, useSelector } from "react-redux"
import { handleNotification } from "redux/notification"
// ** Styles
// ** Components
import notification from "@apps/utility/notification"
import SocketContext from "utility/context/Socket"
import { useFormatMessage } from "@apps/utility/common"

const Notification = (props) => {
  const notificationStore = useSelector((state) => state.notification)
  const listNotificationStore = notificationStore.listNotification
  const numberNotificationStore = notificationStore.numberNotification
  const dispatch = useDispatch()

  const socket = useContext(SocketContext)

  useEffect(() => {
    socket.on("notification", (data) => {
      notification.show({
        title: data.title,
        text: data.body,
        meta: useFormatMessage("common.few_seconds_ago"),
        config: {
          duration: 10000000
        }
      })
    })
  }, [socket])

  // ** handle
  const renderImage = (notification) => {
    if (notification.image !== undefined) {
      return (
        <div className="w-25">
          <div className="d-flex align-items-center div-notification">
            <div className="div-img">
              <img src={notification.image} className="img" />
            </div>
          </div>
        </div>
      )
    }

    return ""
  }

  const renderNotificationBody = (notification) => {
    return (
      <div className="d-flex">
        <Fragment>{renderImage(notification)}</Fragment>
        <div className="pt-1">
          <p className="mb-0 ms-50">{notification.body}</p>
        </div>
      </div>
    )
  }

  onMessageListener()
    .then((payload) => {
      notification.show({
        title: payload.notification.title,
        text: payload.notification.body,
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
