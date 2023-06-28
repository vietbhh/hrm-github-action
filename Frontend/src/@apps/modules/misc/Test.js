import { ErpFileUpload, ErpInput } from "@apps/components/common/ErpField"
import { axiosNodeApi } from "@apps/utility/api"
import { getPublicDownloadUrl, useFormatMessage } from "@apps/utility/common"
import { serialize } from "@apps/utility/handleData"
import { socketConnect } from "@apps/utility/socketHandler"
import { Fragment, useCallback, useContext, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Button } from "reactstrap"
import SocketContext from "@/utility/context/Socket"
import Photo from "../download/pages/Photo"
const Test = (props) => {
  const socketDoc = socketConnect({
    path: "/document"
  })

  const socket = useContext(SocketContext)

  const handleData = useCallback((data) => {
    console.log(data)
  }, [])
  console.log('okkk');
  useEffect(() => {
    //socketDoc.connect()
    //socketDoc.emit("identity", 99999)
    //socket.on("notification", handleData)
    /*socket.emit("app_notification", {
      receivers: [1, 10],
      payload: {
        title: "Trịnh Hải Long",
        body: "uh,cứ thế mà làm" + Math.floor(Math.random() * 100),
        link: "/dashboard",
        image: getPublicDownloadUrl("modules/chat/1_1658109624_avatar.webp")
      }
    })*/
    /* socket.emit("chat_notification", {
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
    }) */
    /*socket.emit("app_notification", {
      receivers: [1],
      save_notification: true,
      payload: {
        title: "<i>bold</i>",
        body: "{{app.save}}",
        link: "/dashboard",
        image: getPublicDownloadUrl("modules/chat/1_1658109624_avatar.webp")
      }
    })*/
  }, [socket])

  const onSubmit = (values) => {
    axiosNodeApi.post("/test", serialize(_.cloneDeep(values))).then((res) => {
      console.log(res)
    })
  }

  const testNoti = () => {
    socket.emit("app_notification", {
      receivers: [1],
      save_notification: true,
      payload: {
        title: "<i>bold</i>",
        body: "{{app.save}}",
        link: "/dashboard",
        icon: getPublicDownloadUrl("modules/feed/matthias_helvar_by_noukette_dbys4l7-fullview--1-.jpg")
      }
    })
    /*axiosNodeApi
      .post("/notification/send", {
        receivers: [1],
        title: "<p>bold</p>",
        body: "{{modules.auth.authentication}}",
        test: "testOk"
      })
      .then((res) => {
        console.log(res)
      })*/

    /* notification.show({
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
    }) */
  }

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods
  return (
    <Fragment>
      <FormProvider {...methods}>
        <ErpInput name="nameInpt" useForm={methods} />
        <ErpFileUpload name="fileTest[]" useForm={methods} multiple />
      </FormProvider>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button type="submit" color="primary">
          {useFormatMessage("app.save")}
        </Button>
      </form>
      <button onClick={testNoti}>noti</button>
    </Fragment>
  )
}

const Test2 = () => {
  return "okkkkkk"
}

export default Test
