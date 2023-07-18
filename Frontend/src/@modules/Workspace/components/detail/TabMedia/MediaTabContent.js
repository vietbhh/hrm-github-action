// ** React Imports
import { useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import { Fragment, useEffect } from "react"
import { getTabIdFromFeedType } from "@modules/Workspace/common/common"
// ** redux
import { useSelector, useDispatch } from "react-redux"
import {
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
    pageLength,
    isLoadable,
    detailWorkspace,
    // ** methods
    setMediaTabActive
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    loadingAll: false,
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

  const loadData = (reset = false, resetPage = false) => {
    const loadingState = reset === true ? "loadingAll" : "loading"
    if (reset) {
      setMediaTabActive(1)
    }

    setState({
      [loadingState]: true,
      hasMore: false,
      hasMoreLazy: false
    })

    workspaceApi
      .loadMedia(id, {
        media_type: reset ? 1 : mediaTabActive,
        page: reset || resetPage ? 0 : state.page,
        page_length: pageLength,
        ...customFilter
      })
      .then((res) => {
        setState({
          data: reset
            ? [...res.data.result]
            : [...state.data, ...res.data.result],
          postData: res.data.post_data,
          totalData: res.data.total_feed,
          page: res.data.page,
          hasMore: res.data.has_more
        })

        setTimeout(() => {
          setState({ [loadingState]: false })
        }, 600)
      })
      .catch((err) => {
        setState({
          data: {},
          [loadingState]: false
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
    if (tabId === mediaTabActive && isLoadable) {
      loadData(false, true)
    }
  }, [isLoadable, mediaTabActive])

  useEffect(() => {
    if (isLoadable) {
      //console.log("test")
      loadData(true)
    }
  }, [detailWorkspace])

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
    } else if (mediaTabActive === 2) {
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
    } else if (mediaTabActive === 3) {
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
    } else if (mediaTabActive === 4) {
      return <MediaLinkItem mediaData={state.data} />
    }
  }

  const renderComponent = () => {
    if (tabId !== mediaTabActive) {
      return ""
    }

    if (Object.keys(state.data).length === 0 && !state.loading) {
      return (
        <div className="empty-member pt-1 w-100">
          <div className="w-100 d-flex flex-column justify-content-center align-items-center mb-2">
            <EmptyContent
              className="custom-empty-content mt-1"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Layer_1"
                  x="0px"
                  y="0px"
                  width="155px"
                  height="150px"
                  viewBox="0 0 155 150"
                  enableBackground="new 0 0 155 150"
                  xmlSpace="preserve">
                  {" "}
                  <image
                    id="image0"
                    width="155"
                    height="150"
                    x="0"
                    y="0"
                    href="data:image/png;base64,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 TkSuQmCC"
                  />
                </svg>
              }
            />
          </div>
        </div>
      )
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
