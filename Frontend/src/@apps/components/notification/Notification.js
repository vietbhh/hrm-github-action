// ** React Imports
import { Fragment, useContext, useEffect } from "react"
// ** redux
import { useDispatch, useSelector } from "react-redux"
import { handleNotification } from "redux/notification"
// ** Styles
// ** Components
import { currentDateTime, useFormatMessage } from "@apps/utility/common"
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

  const addNotificationToStore = (notificationData) => {
    const { id, title, body, link, type, image, sender_id } = notificationData
    const listNotification = [
      {
        id,
        title,
        body,
        link,
        type,
        image,
        sender_id,
        created_at: currentDateTime(),
        seen: false
      },
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
  const showNotificationPopup = (payload, emitKey = "app_notification") => {
    let data = {
      title: payload.title,
      text: payload.body,
      meta: useFormatMessage("common.few_seconds_ago"),
      link: payload.link
    }
    if (payload?.click_action) {
      data.link = payload?.click_action
    }
    if (emitKey === "chat_notification") {
      data = {
        ...data,
        icon: (
          <img
            className="rounded-circle me-1"
            src={payload.icon}
            width={30}
            height={30}
          />
        ),
        config: {
          position: "bottom-right"
        }
      }
    }
    notification.show(data)
  }

  useEffect(() => {
    socket.on("app_notification", (data) => {
      const { payload, isSave } = data
      const sound = new Audio(NotificationSound)
      sound.addEventListener("canplaythrough", (event) => {
        // the audio is now playable; play it if permissions allow
        const playedPromise = sound.play()
        if (playedPromise) {
          playedPromise.catch((e) => {}).then(() => {})
        }
      })
      //show notification
      showNotificationPopup(payload)
      //If save to db,update bell badge and list notification
      if (isSave) {
        addNotificationToStore(payload)
      }
    })

    socket.on("chat_notification", (data) => {
      const { payload } = data
      const skipUrls = data.data?.skipUrls ?? ""
      const skipUrlsArray = skipUrls.split(",")
      if (
        window.location.pathname !== payload.link &&
        !skipUrlsArray.includes(window.location.pathname)
      ) {
        let checkUrlStart = false
        _.forEach(skipUrlsArray, (item) => {
          if (window.location.pathname.startsWith(item)) {
            checkUrlStart = true
          }
        })
        if (!checkUrlStart) {
          const sound = new Audio(ChatSound)
          sound.addEventListener("canplaythrough", (event) => {
            // the audio is now playable; play it if permissions allow
            const playedPromise = sound.play()
            if (playedPromise) {
              playedPromise.catch((e) => {}).then(() => {})
            }
          })
          showNotificationPopup(payload, "chat_notification")
        }
      }
    })
  }, [socket])

  /* navigator.serviceWorker.addEventListener("message", function (event) {
    const { data } = event
    if (data?.isFirebaseMessaging) {
      const payload = data?.notification
      const otherData = data?.data
      const emitKey = otherData?.emitKey ?? ""
      const isSave = otherData?.isSave
      console.log(localStorage.getItem("socket"))
      console.log(socket)
      if (!socket.connected) {
        //showNotificationPopup(payload, emitKey)
        if (isSave === "true") {
          const { id, sender_id } = otherData
          addNotificationToStore({
            id,
            sender_id,
            ...payload
          })
        }
      }
    }
  }) */

  return <Fragment></Fragment>
}

export default Notification
