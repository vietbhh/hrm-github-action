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
    // ** methods
    handleModalPreview,
    setMediaInfo
  } = props

  const handlePreviewFile = (sourceAttribute) => {
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
    const [mediaType] = sourceAttribute.mime.split("/")
    if (mediaType === "image") {
      return (
        <Photo
          src={sourceAttribute.path}
          className="file-thumb"
          preview={false}
        />
      )
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
                  <div className="me-50 image-container">
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
