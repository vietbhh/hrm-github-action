import { useFormatMessage } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { socketConnect } from "@apps/utility/socketHandler"
import { Fragment, useCallback, useContext, useEffect, useRef } from "react"
import SocketContext from "utility/context/Socket"
const Test = (props) => {
  const socketDoc = socketConnect({
    path: "/document"
  })

  const socket = useContext(SocketContext)

  const handleData = useCallback((data) => {
    console.log(data)
  }, [])

  const notificationSound = useRef(null)
  useEffect(() => {
    //socketDoc.connect()
    //socketDoc.emit("identity", 99999)
    //socket.on("notification", handleData)
    socket.emit("send_data_to_users", {
      receiver: 1,
      key: "app_notification",
      push_notification: true,
      save_notification: true,
      data: {
        title: "Trịnh Hải Long",
        body: "uh,cứ thế mà làm" + Math.floor(Math.random() * 100),
        senderType: "user",
        sender: "1",
        link: "#"
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
