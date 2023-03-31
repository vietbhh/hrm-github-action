// ** React Imports
import { getFileTypeFromMime } from "@modules/Workspace/common/common"
import { downloadApi } from "@apps/modules/download/common/api"
// ** Styles
import { Skeleton } from "antd"
import { Card, CardBody, Col, Row } from "reactstrap"
// ** Components
import { LazyLoadComponent } from "react-lazy-load-image-component"
import { Fragment } from "react"

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
    if (item.source_attribute === undefined) {
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

    downloadApi.getPhoto(item.thumb).then((response) => {
      item["url_thumb"] = URL.createObjectURL(response.data)
      const newMediaData = [...mediaData]
      newMediaData[index] = item

      setTimeout(() => {
        setData(newMediaData)
      }, 150)
    })
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

  const renderImage = (item) => {
    if (!item.url_thumb) {
      return <Skeleton.Image active={true} />
    }

    return (
      <div
        className="w-100 h-100 image-container"
        style={{
          backgroundImage: `url("${item.url_thumb}")`
        }}></div>
    )
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
              className="m-0 p-50 col-media-image"
              onClick={() => handleClickImage(item)}>
              <div className="media-image-item">
                <div className="w-100 d-flex flex-column align-items-center justify-content-center">
                  <Fragment>{renderImage(item)}</Fragment>
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
