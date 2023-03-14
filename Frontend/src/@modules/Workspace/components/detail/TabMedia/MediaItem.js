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
        <Photo />
        {mediaItem.data.map((item, index) => {
          return (
            <Col
              sm="2"
              className="m-0 p-0"
              key={`media-image-item-${item._id}`}
              onClick={() => handleClickImage()}>
              <Card>
                <CardBody className="p-0">
                  <div className="w-100 d-flex align-items-center justify-content-center p-50">
                    <img
                      src="https://cdn-thumb-image-2.gapowork.vn/140x140/smart/a97d9f8f-0ad8-4f1e-8954-4f9110e02d0d/matthias_helvar_by_noukette_dbys4l7-fullview _1.jpeg"
                      className="w-100 h-100 rounded"
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
        <MediaFileItem mediaItem={mediaItem} />
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
