// ** React Imports
import Photo from "@apps/modules/download/pages/Photo"
import { Fragment } from "react"
// ** Styles
import { Card, CardBody, Col } from "reactstrap"
// ** Components
import MediaFileItem from "./MediaFileItem"
import MediaPhotoItem from "./MediaPhotoItem"
import MediaVideoItem from "./MediaVideoItem"
import MediaLinkItem from "./MediaLinkItem"

const MediaItem = (props) => {
  const {
    // ** props
    index,
    mediaItem,
    mediaTabActive,
    appSetting,
    // ** methods
    handleModalPreview,
    setMediaInfo
  } = props

  // ** render
  const renderPhoto = () => {
    return (
      <Fragment>
        <MediaPhotoItem
          mediaItem={mediaItem}
          handleModalPreview={handleModalPreview}
          setMediaInfo={setMediaInfo}
        />
      </Fragment>
    )
  }

  const renderFile = () => {
    return (
      <Col sm="12" className="m-0">
        <MediaFileItem
          index={index}
          mediaItem={mediaItem}
          appSetting={appSetting}
          handleModalPreview={handleModalPreview}
          setMediaInfo={setMediaInfo}
        />
      </Col>
    )
  }

  const renderVideo = () => {
    return (
      <Col sm="2" className="m-0 p-0">
        <Card>
          <CardBody className="p-0">
            <MediaVideoItem
              mediaItem={mediaItem}
              handleModalPreview={handleModalPreview}
              setMediaInfo={setMediaInfo}
            />
          </CardBody>
        </Card>
      </Col>
    )
  }

  const renderLink = () => {
    return <MediaLinkItem mediaItem={mediaItem} />
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
