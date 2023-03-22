// ** React Imports
import Photo from "@apps/modules/download/pages/Photo"
import { Fragment } from "react"
// ** Styles
import { Card, CardBody, Col } from "reactstrap"
// ** Components
import MediaFileItem from "./MediaFileItem"
import MediaVideoItem from "./MediaVideoItem"

const MediaItem = (props) => {
  const {
    // ** props
    mediaItem,
    mediaTabActive,
    // ** methods
    handleModalPreview
  } = props

  const handleClickImage = () => {
    handleModalPreview()
  }

  // ** render
  const renderPhoto = () => {
    return (
      <Fragment>
        {mediaItem.data.map((item, index) => {
          return (
            <Col
              sm="2"
              className="m-0 p-0"
              key={`media-image-item-${item._id}`}
              onClick={() => handleClickImage()}>
              <Card className="h-100 media-image-item">
                <CardBody className="p-0">
                  <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-50 image-container">
                    <Photo
                      src={item.thumb}
                      className="w-100 h-100 rounded"
                      preview={false}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          )
        })}
      </Fragment>
    )
  }

  const renderFile = () => {
    return (
      <Col sm="12" className="m-0">
        <MediaFileItem
          mediaItem={mediaItem}
          handleModalPreview={handleModalPreview}
        />
      </Col>
    )
  }

  const renderVideo = () => {
    return (
      <Col sm="2" className="m-0 p-0">
        <Card>
          <CardBody className="p-0">
            <MediaVideoItem />
          </CardBody>
        </Card>
      </Col>
    )
  }

  const renderLink = () => {
    return ""
  }

  const renderComponent = () => {
    if (mediaTabActive === 1) {
      return <Fragment>{renderFile()}</Fragment>
    } else if (mediaTabActive === 2) {
      return <Fragment>{renderPhoto()}</Fragment>
    } else if (mediaTabActive === 3) {
      return <Fragment>{renderVideo()}</Fragment>
    } else if (mediaTabActive === 4) {
      return <Fragment>{renderLink()}</Fragment>
    }
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default MediaItem
