// ** React Imports
import { useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
// ** Styles
import { Card, CardBody, Col } from "reactstrap"
// ** Components
import { EmptyContent } from "@apps/components/common/EmptyContent"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import InfiniteScroll from "react-infinite-scroll-component"
import MediaFileItem from "./MediaFileItem"
import MediaPhotoItem from "./MediaPhotoItem"
import MediaVideoItem from "./MediaVideoItem"
import MediaLinkItem from "./MediaLinkItem"

const MediaTabContent = (props) => {
  const {
    // ** props
    id,
    tabId,
    mediaTabActive,
    pageLength,
    // ** methods
    handleModalPreview,
    setMediaInfo
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    page: 0,
    hasMore: false,
    data: [],
    postData: []
  })

  const appSetting = useSelector((state) => state.auth.settings)

  const loadData = () => {
    workspaceApi
      .loadMedia(id, {
        media_type: mediaTabActive,
        page: state.page,
        page_length: pageLength
      })
      .then((res) => {
        setState({
          data: [...state.data, ...res.data.result],
          postData: res.data.post_data,
          page: res.data.page,
          hasMore: res.data.has_more,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          data: {},
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    setState({
      data: [],
      page: 0,
      loading: true
    })

    if (tabId === mediaTabActive) {
      loadData()
    }
  }, [mediaTabActive])

  // ** render
  const renderItem = () => {
    if (mediaTabActive === 1) {
      return (
        <MediaFileItem
          mediaData={state.data}
          postData={state.postData}
          appSetting={appSetting}
          handleModalPreview={handleModalPreview}
          setMediaInfo={setMediaInfo}
        />
      )
    } else if (mediaTabActive === 2) {
      return (
        <MediaPhotoItem
          mediaData={state.data}
          handleModalPreview={handleModalPreview}
          setMediaInfo={setMediaInfo}
        />
      )
    } else if (mediaTabActive === 3) {
      return (
        <MediaVideoItem
          mediaData={state.data}
          handleModalPreview={handleModalPreview}
          setMediaInfo={setMediaInfo}
        />
      )
    } else if (mediaTabActive === 4) {
      return <MediaLinkItem mediaData={state.data} />
    }
  }

  const renderComponent = () => {
    if (tabId !== mediaTabActive) {
      return ""
    }

    if (state.loading === true) {
      return <AppSpinner className="mt-1" />
    }

    if (Object.keys(state.data).length === 0) {
      return <EmptyContent className="mt-1" />
    }

    return (
      <InfiniteScroll
        dataLength={state.data.length}
        next={loadData}
        hasMore={state.hasMore}>
        <Fragment>{renderItem()}</Fragment>
      </InfiniteScroll>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default MediaTabContent
