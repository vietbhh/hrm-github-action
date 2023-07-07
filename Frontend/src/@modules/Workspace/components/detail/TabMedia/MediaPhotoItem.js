// ** React Imports
import { Fragment } from "react"
import { getFileTypeFromMime } from "@modules/Workspace/common/common"
// ** Styles
import { Skeleton } from "antd"
import { Col, Row } from "reactstrap"
// ** Components
import { LazyLoadComponent } from "react-lazy-load-image-component"
import MediaPhotoImage from "./MediaPhotoImage"
import AppSpinner from "@apps/components/spinner/AppSpinner"

const MediaPhotoItem = (props) => {
  const {
    // ** props
    loading,
    mediaData,
    hasMore,
    // ** methods
    handleModalPreview,
    setMediaInfo,
    setData,
    setHasMoreLazy,
    setLoading
  } = props

  const handleClickImage = (item) => {
    if (item.source_attribute === undefined || Object.keys(item.source_attribute).length === 0) {
      return
    }

    const newSourceAttribute = {
      ...item.source_attribute,
      _id: item._id,
      file_type: getFileTypeFromMime(item.source_attribute.mime)
    }

    setMediaInfo(newSourceAttribute)
    handleModalPreview()
  }

  const handleAfterLoadLazyLoadComponent = (item, index) => {
    setLoading(false)
    if (hasMore) {
      setHasMoreLazy(true)
    }
  }

  // ** render
  const renderLoading = () => {
    if (loading) {
      return (
        <Fragment>
          <Col sm="2" className="m-0 p-50 loading-col-media-image">
            <Skeleton.Image active={true} />
          </Col>
        </Fragment>
      )
    }

    return ""
  }

  return (
    <Row>
      {mediaData.map((item, index) => {
        return (
          <LazyLoadComponent
            key={`media-image-item-${item._id}`}
            afterLoad={() => handleAfterLoadLazyLoadComponent(item, index)}>
            <Col
              sm="2"
              className="m-0 p-50 pb-0 col-media-image"
              onClick={() => handleClickImage(item)}>
              <div className="media-image-item">
                <div className="w-100 d-flex flex-column align-items-center justify-content-center">
                  <MediaPhotoImage src={item.thumb} />
                </div>
              </div>
            </Col>
          </LazyLoadComponent>
        )
      })}

      <Fragment>{renderLoading()}</Fragment>
    </Row>
  )
}

export default MediaPhotoItem
