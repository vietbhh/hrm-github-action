import { FormProvider, useForm } from "react-hook-form"
import { useFormatMessage } from "@apps/utility/common"
import { Upload } from "antd"
import { Fragment, useEffect, useState } from "react"
import notification from "@apps/utility/notification"
import classNames from "classnames"
import { ErpInput, ErpSwitch } from "@apps/components/common/ErpField.js"
import { generateRandomString } from "../common/common"
import { Button, message } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import moment from "moment/moment"
import StickerModalFooter from "./modals/StickerModalFooter"
import { stickerApi } from "../common/api"

export default function StickerCreateOrUpdate({
  state,
  setState,
  onDelete,
  handleCancel,
  getData
}) {
  const [stickerItemList, setStickerItemList] = useState([])
  const [loading, setLoading] = useState(false)

  const stickerId = !state?.stickerEdit ? generateRandomString() : ""

  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      name: state?.stickerEdit?.name,
      is_default: state?.stickerEdit?.default
    }
  })
  const { handleSubmit } = methods

  const onChangeSticker = (file) => {
    const fileList = file.fileList.filter((item) => {
      const isJpgOrPng =
        item.type === "image/jpeg" ||
        item.type === "image/png" ||
        item.type === "image/gif"
      if (!isJpgOrPng) {
        return false
      }

      return true
    })

    if (state?.stickerEdit) {
      const stickerNameList = stickerItemList.map((item) => item.name)
      const newStickerList = fileList.filter(
        (item) => !stickerNameList.includes(item.name)
      )
      setStickerItemList(stickerItemList.concat(newStickerList))
      return
    }

    setStickerItemList(fileList)
  }

  const onPreview = async (file) => {
    let src = file.url
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  const beforeUpload = (file) => {
    const isImageType =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/gif"
    if (!isImageType) {
      message.error(
        useFormatMessage("modules.sticker.modal.messages.error_type_file")
      )
      return false
    }

    return false
  }

  const onRemove = (file) => {
    if (!state?.stickerEdit) {
      return true
    }

    const newStickerItemList = stickerItemList.filter(
      (item) => item.name !== file.name
    )
    setStickerItemList(newStickerItemList)

    return false
  }

  const onSubmit = async (data) => {
    if (stickerItemList.length !== 0) {
      if (!state?.stickerEdit) {
        setLoading(true)
        const formData = new FormData()
        stickerItemList.forEach((element) => {
          formData.append("images", element.originFileObj)
        })

        stickerApi.uploads(formData, stickerId).then(async (dataResponse) => {
          const dataImagesUploadConvert = dataResponse.data.uploadSuccess.map(
            (item, index) => {
              if (index !== 0) {
                return {
                  url: item.path,
                  default: false,
                  upload_at: moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
                }
              }

              return {
                url: item.path,
                default: true,
                upload_at: moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
              }
            }
          )

          const requestData = {
            id: stickerId,
            name: data.name,
            list: dataImagesUploadConvert,
            default: data.is_default
          }
          const results = await stickerApi.create(requestData)
          if (results) {
            if (state.page === 1) {
              getData()
            } else {
              setState({
                page: 1
              })
            }
            setLoading(false)
            handleCancel()
            notification.showSuccess({
              text: useFormatMessage("notification.save.success")
            })
          }
        })
      } else {
        setLoading(true)
        const formData = new FormData()
        const promises = stickerItemList.map((item) => {
          if (!item.hasOwnProperty("originFileObj")) {
            return fetch(item.url)
              .then((response) => response.blob())
              .then((blobData) => {
                const file = new File([blobData], item.name, {
                  type: item.type
                })
                formData.append("images", file)
              })
              .catch((error) => {
                throw new Error(error)
              })
          }

          formData.append("images", item.originFileObj)
        })

        const stickerId = state?.stickerEdit?.id
        Promise.all(promises).then(async () => {
          await stickerApi
            .uploads(formData, stickerId)
            .then(async (dataResponse) => {
              const dataImagesUploadConvert =
                dataResponse.data.uploadSuccess.map((item, index) => {
                  if (index !== 0) {
                    return {
                      url: item.path,
                      default: false,
                      upload_at: moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
                    }
                  }

                  return {
                    url: item.path,
                    default: true,
                    upload_at: moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
                  }
                })

              const requestData = {
                name: data.name,
                list: dataImagesUploadConvert,
                default: data.is_default
              }

              const result = await stickerApi.update(requestData, stickerId)
              if (result) {
                const newStickerList = state.stickerList.map((item) => item)

                const arrDefaults = newStickerList.map((item) => item.default)

                if (!arrDefaults.includes(true)) {
                  newStickerList[newStickerList.length - 1].default = true
                }

                const stickerUpdate = state.stickerList.find((item) => {
                  return item.id == result.data.id
                })

                newStickerList.splice(
                  newStickerList.indexOf(stickerUpdate),
                  1,
                  result.data
                )
                setLoading(false)
                handleCancel()
                setState({
                  stickerList: newStickerList
                })

                notification.showSuccess({
                  text: useFormatMessage("notification.save.success")
                })
              }
            })
        })
      }
    } else {
      message.error(
        useFormatMessage("modules.sticker.modal.messages.error_empty_file")
      )
    }
  }

  useEffect(() => {
    if (state?.stickerEdit) {
      const stickerImageList = state?.stickerEdit.list.map((item, index) => {
        const apiUrl = import.meta.env.VITE_APP_API_URL
        const urlImage = apiUrl + `/download/public/image?name=${item.url}`
        const name = item.url.split("/").pop()

        return {
          uid: index,
          name: name,
          type: "image/" + name.split(".").pop(),
          status: "done",
          url: urlImage,
          thumbUrl: urlImage
        }
      })

      setStickerItemList(stickerImageList)
    }
  }, [state?.stickerEdit])

  return (
    <Fragment>
      <FormProvider {...methods}>
        <ErpInput
          name="name"
          type="text"
          placeholder={useFormatMessage(
            "modules.sticker.modal.placeholder.name"
          )}
          label="Name"
          required
          useForm={methods}
        />
        <section className="row-switch-default">
          <div id="label-switch-default">
            <p>
              {useFormatMessage("modules.sticker.modal.title.switch.default")}
            </p>
            <p>
              {useFormatMessage("modules.sticker.modal.title.switch.title")}
            </p>
          </div>
          <div id="switch-default">
            <ErpSwitch name="is_default" useForm={methods} />
          </div>
        </section>
        <section className="row-upload">
          <Upload
            listType="picture"
            multiple
            onChange={onChangeSticker}
            onPreview={onPreview}
            fileList={stickerItemList}
            beforeUpload={beforeUpload}
            onRemove={onRemove}>
            <Button icon={<UploadOutlined />}>
              {useFormatMessage("modules.sticker.modal.title.upload")}
            </Button>
          </Upload>
        </section>
      </FormProvider>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className={classNames({
            "sticker-row-submit": state?.stickerEdit ? true : false
          })}>
          <StickerModalFooter
            state={state}
            onDelete={onDelete}
            setState={setState}
            loading={loading}
          />
        </div>
      </form>
    </Fragment>
  )
}
