// ** React Imports
import { onMessageListener } from "firebase"
import moment from "moment"
import { Fragment, useContext, useEffect } from "react"
// ** redux
import { useDispatch, useSelector } from "react-redux"
import { handleNotification } from "redux/notification"
// ** Styles
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import ChatSound from "@src/assets/sounds/chat_sound.mp3"
import NotificationSound from "@src/assets/sounds/notification_sound.mp3"
import SocketContext from "utility/context/Socket"

const Notification = (props) => {
  const notificationStore = useSelector((state) => state.notification)
  const listNotificationStore = notificationStore.listNotification
  const numberNotificationStore = notificationStore.numberNotification
  const dispatch = useDispatch()
  // const play = useSo
  const socket = useContext(SocketContext)
  useEffect(() => {
    socket.on("app_notification", (data) => {
      const sound = new Audio(NotificationSound)
      sound.addEventListener("canplaythrough", (event) => {
        // the audio is now playable; play it if permissions allow
        const playedPromise = sound.play()
        if (playedPromise) {
          playedPromise.catch((e) => {}).then(() => {})
        }
      })
      notification.show({
        title: data.title,
        text: data.body,
        meta: useFormatMessage("common.few_seconds_ago")
      })
    })

    socket.on("chat_notification", (data) => {
      const sound = new Audio(ChatSound)
      sound.addEventListener("canplaythrough", (event) => {
        // the audio is now playable; play it if permissions allow
        const playedPromise = sound.play()
        if (playedPromise) {
          playedPromise.catch((e) => {}).then(() => {})
        }
      })
      notification.show({
        title: data.title,
        text: data.body,
        icon: (
          <Avatar className="mt-25 me-50" size="sm" userId={data?.sender} />
        ),
        link: data.link,
        config: {
          duration: 10000000,
          position: "bottom-right"
        }
      })
    })
  }, [socket])

  onMessageListener()
    .then((payload) => {
      console.log(payload)
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

  return <Fragment></Fragment>
}

export default Notification
