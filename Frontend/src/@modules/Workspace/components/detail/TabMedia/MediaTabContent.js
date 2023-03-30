// ** React Imports
import { useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
// ** Styles
import { Card, CardBody, Col } from "reactstrap"
// ** Components
import { EmptyContent } from "@apps/components/common/EmptyContent"
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
    hasMoreLazy: false,
    data: [],
    postData: [],
    totalData: 0
  })

  const appSetting = useSelector((state) => state.auth.settings)

  const loadData = () => {
    setState({
      loading: true,
      hasMore: false,
      hasMoreLazy: false
    })
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
          totalData: res.data.total_feed,
          page: res.data.page,
          hasMore: res.data.has_more
        })

        setTimeout(() => {
          setState({ loading: false })
        }, 1000)
      })
      .catch((err) => {
        setState({
          data: {},
          loading: false
        })
      })
  }

  const setHasMoreLazy = (status) => {
    setState({
      hasMoreLazy: status
    })
  }

  const setData = (data) => {
    setState({
      data: data
    })
  }

  const setLoading = (status) => {
    setState({
      loading: status
    })
  }

  // ** effect
  useEffect(() => {
    setState({
      data: [],
      page: 0
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
          loading={state.loading}
          mediaData={state.data}
          postData={state.postData}
          hasMore={state.hasMore}
          appSetting={appSetting}
          handleModalPreview={handleModalPreview}
          setMediaInfo={setMediaInfo}
          setData={setData}
          setHasMoreLazy={setHasMoreLazy}
          setLoading={setLoading}
        />
      )
    } else if (mediaTabActive === 2) {
      return (
        <MediaPhotoItem
          loading={state.loading}
          mediaData={state.data}
          hasMore={state.hasMore}
          handleModalPreview={handleModalPreview}
          setMediaInfo={setMediaInfo}
          setData={setData}
          setHasMoreLazy={setHasMoreLazy}
          setLoading={setLoading}
        />
      )
    } else if (mediaTabActive === 3) {
      return (
        <MediaVideoItem
          loading={state.loading}
          mediaData={state.data}
          totalData={state.totalData}
          hasMore={state.hasMore}
          handleModalPreview={handleModalPreview}
          setMediaInfo={setMediaInfo}
          setData={setData}
          setHasMoreLazy={setHasMoreLazy}
          setLoading={setLoading}
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

    if (Object.keys(state.data).length === 0 && !state.loading) {
      return <EmptyContent className="mt-1" />
    }

    return (
      <InfiniteScroll
        dataLength={state.data.length}
        next={loadData}
        hasMore={state.hasMoreLazy}>
        <Fragment>{renderItem()}</Fragment>
      </InfiniteScroll>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default MediaTabContent
