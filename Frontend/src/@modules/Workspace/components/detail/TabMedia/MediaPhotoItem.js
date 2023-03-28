// ** React Imports
import { Fragment } from "react"
import { getFileTypeFromMime } from "@modules/Workspace/common/common"
// ** Styles
import { Card, CardBody, Col } from "reactstrap"
// ** Components
import Photo from "@apps/modules/download/pages/Photo"

const MediaPhotoItem = (props) => {
  const {
    // ** props
    mediaItem,
    // ** methods
    handleModalPreview,
    setMediaInfo
  } = props

  const handleClickImage = (item) => {
    if (item.source_attribute === undefined) {
      return 
    }

    const newSourceAttribute = {
      ...item.source_attribute,
      file_type: getFileTypeFromMime(item.source_attribute.mime)
    }

    setMediaInfo(newSourceAttribute)
    handleModalPreview()
  }

  // ** render
  return (
    <Fragment>
      {mediaItem.data.map((item, index) => {
        return (
          <Col
            sm="2"
            className="m-0 p-0 col-media-image"
            key={`media-image-item-${item._id}`}
            onClick={() => handleClickImage(item)}>
            <Card className="media-image-item">
              <CardBody className="p-0">
                <div className="w-100 d-flex flex-column align-items-center justify-content-center p-50 image-container">
                  <Photo src={item.thumb} className="rounded" preview={false} />
                </div>
              </CardBody>
            </Card>
          </Col>
        )
      })}
    </Fragment>
  )
}

export default MediaPhotoItem
