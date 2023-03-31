// ** React Imports
import { getFileTypeFromMime } from "@modules/Workspace/common/common"
import { downloadApi } from "@apps/modules/download/common/api"
// ** Styles
import { Skeleton } from "antd"
import { Row, Col } from "reactstrap"
// ** Components
import Photo from "@apps/modules/download/pages/Photo"
import { LazyLoadComponent } from "react-lazy-load-image-component"
import { Fragment } from "react"

const MediaVideoItem = (props) => {
  const {
    // ** props
    loading,
    mediaData,
    totalData,
    hasMore,
    // ** methods
    handleModalPreview,
    setMediaInfo,
    setData,
    setHasMoreLazy,
    setLoading
  } = props

  const max = 6
  const remain = totalData - mediaData.length
  const number = remain > max ? max : remain

  const handleClickPlay = (item) => {
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
      }, 200)
    })
  }

  // ** render
  const renderLoading = () => {
    if (loading) {
      return (
        <Col sm="2" className="m-0 p-50 loading-col-media-image">
          <div className="w-100 d-flex align-items-center justify-content-center media-video-item">
            <Skeleton.Image active={true} />
          </div>
        </Col>
      )
    }

    return ""
  }

  const renderThumb = (item) => {
    if (!item.url_thumb) {
      return <Skeleton.Image active={true} />
    }

    return (
      <div
        className="w-100 h-100 image-container"
        style={{
          backgroundImage: `url("${item.url_thumb}")`
        }}>
        <div className="position-absolute top-50 start-50 translate-middle">
          <svg
            width="24"
            height="26"
            viewBox="0 0 24 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.08917 3.81094C1.30809 1.14929 4.14466 -0.467073 6.57042 0.650053C12.0022 3.15151 17.1827 6.31443 21.8796 10.0157C23.8101 11.5369 23.8101 14.463 21.8796 15.9842C17.1827 19.6855 12.0022 22.8484 6.57042 25.3498C4.14466 26.467 1.30809 24.8506 1.08917 22.189L0.87276 19.5579C0.513768 15.1933 0.513767 10.8066 0.87276 6.44201L1.08917 3.81094Z"
              fill="white"></path>
          </svg>
        </div>
        <div className="position-absolute bottom-0 end-0">
          <p className="pe-1 text-white">{item?.time}</p>
        </div>
      </div>
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
              key={`media-video-item-${item._id}`}
              className="m-0 p-50"
              onClick={() => handleClickPlay(item)}>
              <div className="w-100 d-flex align-items-center justify-content-center media-video-item">
                <div className="w-100 position-relative video-thumb">
                  <div className="w-100 d-flex flex-column align-items-center justify-content-center">
                    <Fragment>{renderThumb(item)}</Fragment>
                  </div>
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

export default MediaVideoItem
