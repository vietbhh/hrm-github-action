// ** React Imports
import { Fragment } from "react"
import moment from "moment"
import {
  getFileTypeFromMime,
  formatByte
} from "@modules/Workspace/common/common"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import Photo from "@apps/modules/download/pages/Photo"
import FileImageByType from "./FileImageByType"
import ActionMediaFileItem from "./ActionMediaFileItem"

const MediaFileItem = (props) => {
  const {
    // ** props
    mediaData,
    postData,
    appSetting,
    // ** methods
    handleModalPreview,
    setMediaInfo
  } = props

  const dataFile = {}
  mediaData.map((item) => {
    const createdAt = moment(item.created_at).format("Do MMM YYYY")
    if (dataFile[createdAt] === undefined) {
      dataFile[createdAt] = {}
    }

    const ref = item.ref
    if (ref !== null) {
      if (dataFile[createdAt][ref] === undefined) {
        const [postInfo] = postData.filter((itemFilter) => {
          return itemFilter._id === ref && itemFilter.type === "post"
        })

        dataFile[createdAt][ref] = {
          info: postInfo,
          data: []
        }
      }

      dataFile[createdAt][ref]["data"].push(item)
    } else {
      dataFile[createdAt][item._id] = {
        info: item,
        data: [item]
      }
    }
  })

  const handlePreviewFile = (sourceAttribute, id) => {
    const type = getFileTypeFromMime(sourceAttribute.mime)
    if (type === "") {
      return ""
    }

    const newSourceAttribute = {
      ...sourceAttribute,
      _id: id,
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
                  onClick={() => handlePreviewFile(sourceAttribute, item._id)}>
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
                  <ActionMediaFileItem item={item} />
                </div>
              </CardBody>
            </Card>
          )
        })}
      </Fragment>
    )
  }

  const renderComponent = () => {
    return (
      <Fragment>
        {_.map(dataFile, (item, index) => {
          return (
            <div className="mb-4" key={`media-file-item-${index}`}>
              <h5 className="time-title">{index}</h5>
              {_.map(item, (itemMedia, indexMedia) => {
                return (
                  <div
                    className="ms-50 w-100 mb-2 media-file-item"
                    key={`media-file-item-${index}-${indexMedia}`}>
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
                      dangerouslySetInnerHTML={{
                        __html: itemMedia.info.content
                      }}
                      className="ms-75"></div>
                    <div className="w-100">
                      <Fragment>{renderFileItem(itemMedia)}</Fragment>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default MediaFileItem
