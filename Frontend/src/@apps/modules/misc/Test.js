import {
  getAvatarUrl,
  getPublicDownloadUrl,
  useFormatMessage
} from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { socketConnect } from "@apps/utility/socketHandler"
import { Fragment, useCallback, useContext, useEffect } from "react"
import SocketContext from "utility/context/Socket"
const Test = (props) => {
  const socketDoc = socketConnect({
    path: "/document"
  })

  const socket = useContext(SocketContext)

  const handleData = useCallback((data) => {
    console.log(data)
  }, [])

  useEffect(() => {
    //socketDoc.connect()
    //socketDoc.emit("identity", 99999)
    //socket.on("notification", handleData)
    socket.emit("app_notification", {
      receivers: [1, 10],
      payload: {
        title: "Trịnh Hải Long",
        body: "uh,cứ thế mà làm" + Math.floor(Math.random() * 100),
        senderType: "user",
        sender: "1",
        link: "#"
      }
    })
    socket.emit("chat_notification", {
      receivers: 1,
      payload: {
        title: "John Doe",
        body: "well done!!!",
        link: "/chat/hailongtrinh",
        icon: getAvatarUrl("avatars/1/1_avatar.webp"),
        image: getPublicDownloadUrl("modules/chat/1_1658109624_avatar.webp")
      },
      data: {
        skipUrls: "/chat/hailongtrinh,/chat/dlskalskdjdf"
      }
    })
  }, [socket])

  const testNoti = () => {
    notification.show({
      title: "bạn nhận được thông báo",
      config: {
        duration: 10000000
      }
    })
    notification.showSuccess({
      text: useFormatMessage("notification.delete.success"),
      config: {
        duration: 10000000
      }
    })
    notification.showError({
      text: useFormatMessage("notification.delete.success"),
      config: {
        duration: 10000000
      }
    })
    notification.showInfo({
      text: useFormatMessage("notification.delete.success"),
      config: {
        duration: 10000000
      }
    })
    notification.showWarning({
      text: useFormatMessage("notification.delete.success"),
      config: {
        duration: 10000000
      }
    })
  }

  return (
    <Fragment>
      <button onClick={testNoti}>noti</button>
    </Fragment>
  )
}

export default Test
