// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import moment from "moment"
// ** Styles
import { Button, Card, CardBody } from "reactstrap"
import { Dropdown } from "antd"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import Photo from "@apps/modules/download/pages/Photo"

const MediaFileItem = (props) => {
  const {
    // ** props
    mediaItem,
    appSetting,
    // ** methods
    handleModalPreview,
    setMediaInfo
  } = props

  const handlePreviewFile = (sourceAttribute) => {
    const arrMime = sourceAttribute.mime.split("/")
    const mediaType = arrMime[0]
    if (appSetting.upload_type === "direct" && mediaType === "file") {
      //return
    }

    setMediaInfo(sourceAttribute)
    handleModalPreview()
  }

  const handleClickDownload = () => {}

  const handleClickViewPost = () => {}

  const items = [
    {
      key: "1",
      label: (
        <Button.Ripple
          color="flat-secondary"
          size="sm"
          onClick={() => handleClickDownload()}
          className="w-100">
          <i className="far fa-cloud-download-alt me-50" />

          <span className="align-middle">
            {useFormatMessage("modules.workspace.buttons.download")}
          </span>
        </Button.Ripple>
      )
    },
    {
      key: "2",
      label: (
        <Button.Ripple
          color="flat-secondary"
          size="sm"
          onClick={() => handleClickViewPost()}
          className="w-100">
          <i className="fal fa-newspaper me-50" />
          <span className="align-middle">
            {useFormatMessage("modules.workspace.buttons.view_post")}
          </span>
        </Button.Ripple>
      )
    }
  ]

  const formatByte = (bytes, decimals = 2) => {
    if (!+bytes) return "0 Bytes"

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  // ** render
  const renderFileImage = (sourceAttribute) => {
    const arrMime = sourceAttribute.mime.split("/")
    const mediaType = arrMime[0]
    if (mediaType === "image") {
      return (
        <Photo
          src={sourceAttribute.path}
          className="file-thumb"
          preview={false}
        />
      )
    } else if (mediaType === "file") {
      const fileType = arrMime[1]
      if (fileType === "xlsx") {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            width="38px"
            height="38px"
            viewBox="0 0 512 512"
            enableBackground="new 0 0 512 512"
            xmlSpace="preserve">
            {" "}
            <image
              id="image0"
              width="512"
              height="512"
              x="0"
              y="0"
              href="data:image/png;base64,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"
            />
          </svg>
        )
      }
    }
  }

  const renderFileItem = () => {
    if (mediaItem.data === undefined) {
      return ""
    }

    return (
      <Fragment>
        {mediaItem.data.map((item, index) => {
          const sourceAttribute = item.source_attribute
          if (sourceAttribute === undefined) {
            return ""
          }

          return (
            <Card
              className="mb-50"
              key={`media-file-item-${item._id}`}
              onClick={() => handlePreviewFile(sourceAttribute)}>
              <CardBody className="border rounded d-flex align-items-center justify-content-between p-75">
                <div className="d-flex align-items-start">
                  <div className="me-75 image-container">
                    <Fragment>{renderFileImage(sourceAttribute)}</Fragment>
                  </div>
                  <div className="info">
                    <h6 className="mb-25">{sourceAttribute.name}</h6>
                    <small>
                      <span>{formatByte(sourceAttribute.size)}</span>
                      <span className="ps-1">
                        {moment(item.created_at).format("YYYY/MM/DD")}
                      </span>{" "}
                      <span className="ps-25">
                        {moment(item.created_at).format("hh:mm A")}
                      </span>
                    </small>
                  </div>
                </div>
                <div>
                  <Dropdown
                    placement="bottomRight"
                    menu={{ items }}
                    trigger="click"
                    overlayClassName="dropdown-workspace-group-rule">
                    <Button.Ripple color="flat-secondary" className="btn-icon">
                      <i className="fas fa-ellipsis-h" />
                    </Button.Ripple>
                  </Dropdown>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </Fragment>
    )
  }

  return (
    <div className="ms-50 w-100 mb-2 media-file-item">
      <div className="p-1 d-flex align-items-center justify-content0-center">
        <Avatar src={mediaItem.info.owner_info?.avatar} className="me-50" />
        <p className="mb-0 font-weight-bold">
          {mediaItem.info.owner_info?.full_name}
        </p>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: mediaItem.info.content }}
        className="ms-75"></div>
      <div className="w-100">
        <Fragment>{renderFileItem()}</Fragment>
      </div>
    </div>
  )
}

export default MediaFileItem
