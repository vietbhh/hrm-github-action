// ** React Imports
import { useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import { Fragment, useEffect, Suspense } from "react"
import {
  getFileTypeFromMime,
  getTabIdFromFeedType
} from "@modules/Workspace/common/common"
// ** redux
import { useSelector, useDispatch } from "react-redux"
import {
  showModalCreatePost,
  hideModalCreatePost,
  setModalCreatePost
} from "@modules/Workspace/common/reducer/workspace"
// ** Styles
// ** Components
import { EmptyContent } from "@apps/components/common/EmptyContent"
import InfiniteScroll from "react-infinite-scroll-component"
import MediaFileItem from "./MediaFileItem"
import MediaPhotoItem from "./MediaPhotoItem"
import MediaVideoItem from "./MediaVideoItem"
import MediaLinkItem from "./MediaLinkItem"
import ModalCreatePost from "@/components/hrm/CreatePost/CreatePostDetails/modals/ModalCreatePost"
import PreviewMediaContentModal from "../../modals/PreviewMediaContentModal/PreviewMediaContentModal"

const MediaTabContent = (props) => {
  const {
    // ** props
    id,
    customFilter,
    tabId,
    mediaTabActive,
    pageLength
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    page: 0,
    hasMore: false,
    hasMoreLazy: false,
    data: [],
    postData: [],
    dataCreateNew: [],
    totalData: 0,
    mediaInfo: {},
    modalPreview: false
  })

  const appSetting = useSelector((state) => state.auth.settings)
  const userAuth = useSelector((state) => state.auth.userData)

  const workspaceState = useSelector((state) => state.workspace)
  const { modalCreatePost } = workspaceState

  const dispatch = useDispatch()

  const handleHideModal = () => {
    dispatch(hideModalCreatePost())
  }

  const setModal = (status) => {
    dispatch(setModalCreatePost(status))
  }

  const setMediaInfo = (data) => {
    setState({
      mediaInfo: data
    })
  }

  const handleModalPreview = () => {
    setState({
      modalPreview: !state.modalPreview
    })
  }

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
        page_length: pageLength,
        ...customFilter
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

  const setDataCreateNew = (newData) => {
    if (newData) {
      if (newData.type === "post") {
        const dataMedia = []
        newData.medias.reverse().map((item) => {
          const tabId = getTabIdFromFeedType(item.type)
          if (tabId === mediaTabActive) {
            dataMedia.push(item)
          }
        })

        setData([...dataMedia, ...state.data])
      } else if (newData.type !== "post") {
        const tabId = getTabIdFromFeedType(newData.type)
        if (tabId === mediaTabActive) {
          setData([newData, ...state.data])
        }
      }
    }
  }

  const resetData = () => {
    setState({
      data: [],
      page: 0
    })
  }

  // ** effect
  useEffect(() => {
    resetData()

    if (tabId === mediaTabActive) {
      loadData()
    }
  }, [mediaTabActive])

  useEffect(() => {
    if (state.modalPreview) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [state.modalPreview])

  // ** render
  const renderModalCreatePost = () => {
    if (tabId === mediaTabActive) {
      return (
        <ModalCreatePost
          modal={modalCreatePost}
          toggleModal={handleHideModal}
          avatar={userAuth?.avatar}
          fullName={userAuth?.full_name}
          userId={userAuth?.id}
          dataMention={[]}
          workspace={id}
          setModal={setModal}
          setDataCreateNew={setDataCreateNew}
          approveStatus="approved"
        />
      )
    }

    return ""
  }

  const renderModalPreview = () => {
    if (state.modalPreview) {
      return (
        <PreviewMediaContentModal
          modal={state.modalPreview}
          mediaInfo={state.mediaInfo}
          mediaTabActive={mediaTabActive}
          handleModal={handleModalPreview}
        />
      )
    }

    return ""
  }

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

  return (
    <Fragment>
      {renderComponent()}
      {renderModalCreatePost()}
      {renderModalPreview()}
    </Fragment>
  )
}

export default MediaTabContent
