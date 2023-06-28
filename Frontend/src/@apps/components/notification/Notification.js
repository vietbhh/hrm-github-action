// ** React Imports
import { Fragment, useContext, useEffect } from "react"
import {
  handleFormatMessageStr
} from "layouts/_components/vertical/common/common"
// ** redux
import { useDispatch } from "react-redux"
import { handleAppendNotification } from "@store/notification"
// ** Styles
// ** Components
import { currentDateTime, useFormatMessage } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import ChatSound from "@src/assets/sounds/chat_sound.mp3"
import NotificationSound from "@src/assets/sounds/notification_sound.mp3"
import SocketContext from "@/utility/context/Socket"

const Notification = (props) => {
  const dispatch = useDispatch()
  const socket = useContext(SocketContext)

  const addNotificationToStore = (notificationData) => {
    const { id, title, body, link, type, icon, sender_id } = notificationData

    dispatch(
      handleAppendNotification({
        id,
        title,
        body,
        link,
        type,
        icon,
        sender_id,
        created_at: currentDateTime(),
        seen: false
      })
    )
  }
  
  const showNotificationPopup = (payload, emitKey = "app_notification") => {
    const newTitle = handleFormatMessageStr(payload.title)
    const newText = handleFormatMessageStr(payload.body)
    let data = {
      title: newTitle,
      text: newText,
      meta: useFormatMessage("common.few_seconds_ago"),
      link: payload.link
    }
    if (payload?.click_action) {
      data.link = payload?.click_action
    }
    if (emitKey === "chat_notification") {
      data = {
        ...data,
        icon:  (
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
      sound.addEventListener(
        "canplaythrough",
        (event) => {
          // the audio is now playable; play it if permissions allow
          const playedPromise = sound.play()
          if (playedPromise) {
            playedPromise.catch((e) => {}).then(() => {})
          }
        },
        { passive: true }
      )
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
          sound.addEventListener(
            "canplaythrough",
            (event) => {
              // the audio is now playable; play it if permissions allow
              const playedPromise = sound.play()
              if (playedPromise) {
                playedPromise.catch((e) => {}).then(() => {})
              }
            },
            { passive: true }
          )
          showNotificationPopup(payload, "chat_notification")
        }
      }
    })
  }, [socket])

  return <Fragment></Fragment>
}

export default Notification
