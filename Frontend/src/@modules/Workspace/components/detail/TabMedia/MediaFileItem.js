// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import moment from "moment"
import { getFileTypeFromMime } from "@modules/Workspace/common/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import { Link } from "react-router-dom"
// ** Styles
import { Button, Card, CardBody } from "reactstrap"
import { Dropdown } from "antd"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import Photo from "@apps/modules/download/pages/Photo"
import FileImageByType from "./FileImageByType"

const MediaFileItem = (props) => {
  const {
    // ** props
    index,
    mediaItem,
    appSetting,
    // ** methods
    handleModalPreview,
    setMediaInfo
  } = props

  console.log(mediaItem)

  const [state, setState] = useMergedState({
    openDropdown: false,
    currentMediaItem: {}
  })

  const handlePreviewFile = (sourceAttribute) => {
    const type = getFileTypeFromMime(sourceAttribute.mime)
    if (type === "") {
      return ""
    }

    const newSourceAttribute = {
      ...sourceAttribute,
      previewable: true,
      file_type: type
    }

    if (
      appSetting.upload_type === "direct" &&
      (type === "excel" || type === "word")
    ) {
      newSourceAttribute["previewable"] = false
    }

    if (type === "video" || type === "sound" || type === "zip") {
      newSourceAttribute["previewable"] = false
    }

    setMediaInfo(newSourceAttribute)
    handleModalPreview()
  }

  const handleClickDownload = () => {
    const sourceAttribute = state.currentMediaItem.source_attribute
    workspaceApi
      .downloadMedia(sourceAttribute.path)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `${sourceAttribute.name}`)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
        handleToggleDropdown()
      })
      .catch((err) => {})
  }

  const handleClickViewPost = () => {}

  const handleToggleDropdown = (item) => {
    setState({
      currentMediaItem: !state.openDropdown ? item : {},
      openDropdown: !state.openDropdown
    })
  }

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
        <Link to={`/posts/${state.currentMediaItem._id}`}>
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
        </Link>
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
    } else {
      return <FileImageByType mime={sourceAttribute.mime} />
    }
  }

  const renderFileItem = (itemMedia) => {
    if (itemMedia.data === undefined) {
      return ""
    }

    return (
      <Fragment>
        {itemMedia.data.map((item, index) => {
          const sourceAttribute = item.source_attribute
          if (sourceAttribute === undefined) {
            return ""
          }

          return (
            <Card className="mb-50" key={`media-file-item-${item._id}`}>
              <CardBody className="border rounded d-flex align-items-center justify-content-between p-75">
                <div
                  className="d-flex align-items-start pointer"
                  onClick={() => handlePreviewFile(sourceAttribute)}>
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
                    trigger="focus"
                    open={state.openDropdown}
                    onClick={() => handleToggleDropdown(item)}
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

  const renderComponent = () => {
    console.log(mediaItem)
    return (
      <div className="mb-4">
        <h5 className="time-title">{index}</h5>
        {_.map(mediaItem, (itemMedia) => {
          return (
            <div className="ms-50 w-100 mb-2 media-file-item">
              <div className="p-1 d-flex align-items-center">
                <Avatar
                  src={itemMedia.info.owner_info?.avatar}
                  className="me-50"
                />
                <p className="mb-0 font-weight-bold">
                  {itemMedia.info.owner_info?.full_name}
                </p>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: itemMedia.info.content }}
                className="ms-75"></div>
              <div className="w-100">
                <Fragment>{renderFileItem(itemMedia)}</Fragment>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default MediaFileItem
