// ** React Imports
import { Fragment, useEffect } from "react"
import { useMergedState } from "@apps/utility/common"
import classNames from "classnames"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { Skeleton, Space } from "antd"
// ** Styles
// ** Components

const LinkPreview = (props) => {
  const {
    // ** props
    componentClassName,
    url,
    cardSize,
    showGraphic,
    defaultImage,
    maxLine,
    minLine,
    // ** component
    loadingComponent
    // ** methods
  } = props

  console.log(minLine)

  const [state, setState] = useMergedState({
    loading: true,
    data: {}
  })

  const getLinkContent = () => {
    setState({
      loading: true
    })

    defaultModuleApi
      .getLinkContent({
        link: url
      })
      .then((res) => {
        setState({
          data: res.data.result,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    getLinkContent()
  }, [url])

  // ** render
  const renderMediumLoading = () => {
    return (
      <div className="h-100 d-flex w-100">
        <div className="me-2">
          <Skeleton.Image active={state.loading} round={true} />
        </div>
        <div className="w-75 d-flex flex-column align-items-start justify-content-start h-100">
          <Skeleton
            paragraph={{
              rows: 2
            }}
          />
        </div>
      </div>
    )
  }

  const renderLargeLoading = () => {
    return (
      <div className="h-100 d-flex flex-column w-100">
        <div className="mb-1">
          <Skeleton.Image
            active={state.loading}
            className="w-100"
            round={true}
          />
        </div>
        <div className="w-75 d-flex flex-column align-items-start justify-content-start h-100">
          <Skeleton
            paragraph={{
              rows: 1
            }}
          />
        </div>
      </div>
    )
  }

  const renderLoading = () => {
    return cardSize === "medium" ? renderMediumLoading() : renderLargeLoading()
  }

  const renderImage = () => {
    if (!showGraphic) {
      return ""
    }

    if (
      (defaultImage === "" || defaultImage === undefined) &&
      (state.data?.images === undefined || state.data?.images.length === 0)
    ) {
      return ""
    }

    const imgHref =
      state.data.images.length === 0 ? defaultImage : [state.data?.images]

    return (
      <div className="image-link-container">
        <div
          style={{ backgroundImage: `url(${imgHref})` }}
          className="image-link"
        />
      </div>
    )
  }

  const renderComponent = () => {
    return (
      <div
        className={`preview-link-component ${classNames(componentClassName)}`}>
        {state.loading ? (
          loadingComponent === undefined ? (
            renderLoading()
          ) : (
            loadingComponent
          )
        ) : (
          <a
            href={url}
            className={classNames({
              "medium-preview-card": cardSize === "medium",
              "large-preview-card": cardSize === "large"
            })}>
            <div className="d-flex detail-link">
              <Fragment>{renderImage()}</Fragment>
              <div className="ps-2 pt-1 content-link-container">
                <h6
                  style={{
                    overflow: "hidden",
                    width: "100%",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: minLine === undefined ? 1 : minLine,
                    lineHeight: "1.5em",
                    maxHeight: `${
                      (maxLine === undefined ? 1 : maxLine) * 1.5
                    }em`
                  }}>
                  {state.data?.title}
                </h6>
                <p
                  className="description"
                  style={{
                    overflow: "hidden",
                    width: "100%",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: minLine === undefined ? 2 : minLine,
                    lineHeight: "1.5em",
                    maxHeight: `${
                      (maxLine === undefined ? 2 : maxLine) * 1.5
                    }em`
                  }}>
                  {state.data?.description}
                </p>
              </div>
            </div>
          </a>
        )}
      </div>
    )
  }

  return renderComponent()
}

export default LinkPreview

LinkPreview.defaultProps = {
  cardSize: "medium"
}
