import { downloadApi } from "@apps/modules/download/common/api"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
import { Skeleton } from "antd"
import { useEffect, useRef } from "react"
import ReactDOM from "react-dom"
import PerfectScrollbar from "react-perfect-scrollbar"
import { Modal, ModalBody } from "reactstrap"
import ButtonReaction from "../PostDetails/ButtonReaction"
import PostComment from "../PostDetails/PostComment"
import PostHeader from "../PostDetails/PostHeader"
import PostShowReaction from "../PostDetails/PostShowReaction"
import RenderContentPost from "../PostDetails/RenderContentPost"

const PostImageDetailModal = (props) => {
  const {
    modal,
    toggleModal,
    dataModal,
    idImage,
    setIdImage,
    postType,
    dataMedias,
    current_url,
    dataMention,
    customAction = {}, // custom dropdown post header
    setDataPost
  } = props
  const [state, setState] = useMergedState({
    data: {},
    id_previous: "",
    id_next: "",
    comment_more_count_original: dataModal.comment_more_count
  })
  const imageRef = useRef(null)
  const refDivBackLeft = useRef(null)
  const refDivBackRight = useRef(null)
  const refDivLeft = useRef(null)
  const refDivComment = useRef(null)

  // ** function
  const scrollToBottom = () => {
    if (refDivComment.current) {
      const chatContainer = ReactDOM.findDOMNode(refDivComment.current)
      chatContainer.scrollTop = Number.MAX_SAFE_INTEGER
    }
  }

  const handleCloseModal = () => {
    toggleModal()
    window.history.replaceState(null, "", current_url)
  }

  const setDataMedia = (data) => {
    setState({
      data: {
        ...data,
        url_thumb: state.data.url_thumb,
        url_source: state.data.url_source,
        medias: state.data.medias
      }
    })
  }

  const setCommentMoreCountOriginal = (value = 0) => {
    setState({ comment_more_count_original: value })
  }

  // ** useEffect
  useEffect(() => {
    if (modal) {
      if (postType === "post") {
        const indexMedia = dataMedias.findIndex((item) => item._id === idImage)
        if (indexMedia !== -1) {
          setState({ data: {} })
          const id_next = dataMedias[indexMedia + 1]
            ? dataMedias[indexMedia + 1]._id
            : dataMedias[0]._id
          const id_previous = dataMedias[indexMedia - 1]
            ? dataMedias[indexMedia - 1]._id
            : dataMedias[dataMedias.length - 1]._id
          setState({ id_previous: id_previous, id_next: id_next })
          feedApi
            .getGetFeed(idImage)
            .then((res) => {
              const _data = res.data
              downloadApi
                .getPhoto(dataMedias[indexMedia].source)
                .then((response) => {
                  _data["url_source"] = URL.createObjectURL(response.data)
                  setState({ data: _data })
                })
              setState({
                comment_more_count_original: _data.comment_more_count
              })
            })
            .catch((err) => {})
        } else {
          setState({ data: {}, id_previous: "", id_next: "" })
        }
      }

      if (
        postType === "image" ||
        postType === "video" ||
        postType === "update_cover" ||
        postType === "update_avatar"
      ) {
        setState({ data: {}, id_previous: "", id_next: "" })
        feedApi
          .getGetFeed(idImage)
          .then((res) => {
            const _data = res.data
            downloadApi.getPhoto(_data.source).then((response) => {
              _data["url_source"] = URL.createObjectURL(response.data)
              setState({ data: _data })
            })
            setState({
              comment_more_count_original: _data.comment_more_count
            })
          })
          .catch((err) => {})
      }
    }
  }, [idImage, postType, dataMedias, modal])

  useEffect(() => {
    const handleKeydown = (event) => {
      // left
      if (event.keyCode === 37) {
        setIdImage(state.id_previous)
        window.history.replaceState(
          null,
          "",
          `/posts/${dataModal._id}/${state.id_previous}`
        )
      }

      // right
      if (event.keyCode === 39) {
        setIdImage(state.id_next)
        window.history.replaceState(
          null,
          "",
          `/posts/${dataModal._id}/${state.id_next}`
        )
      }
    }
    window.addEventListener("keydown", handleKeydown)

    return () => {
      window.removeEventListener("keydown", handleKeydown)
    }
  }, [state.id_previous, state.id_next, dataModal])

  useEffect(() => {
    function handleClickOutside(event) {
      setTimeout(() => {
        if (state.data.url_source) {
          if (refDivLeft.current && refDivLeft.current.contains(event.target)) {
            if (
              (imageRef.current && imageRef.current.contains(event.target)) ||
              (refDivBackLeft.current &&
                refDivBackLeft.current.contains(event.target)) ||
              (refDivBackRight.current &&
                refDivBackRight.current.contains(event.target))
            ) {
              // do nothing
            } else {
              handleCloseModal()
            }
          }
        }
      }, 200)
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.addEventListener("mousedown", handleClickOutside)
    }
  }, [imageRef, refDivBackLeft, refDivBackRight, refDivLeft, state.data])

  // ** render
  const renderDivBack = () => {
    if (postType === "post") {
      return (
        <>
          <div className="div-back left" ref={refDivBackLeft}>
            <a
              className="slide-navigator"
              onClick={(e) => {
                e.preventDefault()
                setIdImage(state.id_previous)
                window.history.replaceState(
                  null,
                  "",
                  `/posts/${dataModal._id}/${state.id_previous}`
                )
              }}>
              <svg
                width="10"
                height="18"
                viewBox="0 0 16 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.4142 27.4142C16.1953 26.6332 16.1953 25.3668 15.4142 24.5858L4.82843 14L15.4142 3.41421C16.1953 2.63317 16.1953 1.36683 15.4142 0.585787C14.6332 -0.195263 13.3668 -0.195263 12.5858 0.585787L0.585786 12.5858C-0.195262 13.3668 -0.195262 14.6332 0.585786 15.4142L12.5858 27.4142C13.3668 28.1953 14.6332 28.1953 15.4142 27.4142Z"
                  fill="white"></path>
              </svg>
            </a>
          </div>
          <div className="div-back right" ref={refDivBackRight}>
            <a
              className="slide-navigator"
              onClick={(e) => {
                e.preventDefault()
                setIdImage(state.id_next)
                window.history.replaceState(
                  null,
                  "",
                  `/posts/${dataModal._id}/${state.id_next}`
                )
              }}>
              <svg
                width="10"
                height="18"
                viewBox="0 0 16 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.4142 27.4142C16.1953 26.6332 16.1953 25.3668 15.4142 24.5858L4.82843 14L15.4142 3.41421C16.1953 2.63317 16.1953 1.36683 15.4142 0.585787C14.6332 -0.195263 13.3668 -0.195263 12.5858 0.585787L0.585786 12.5858C-0.195262 13.3668 -0.195262 14.6332 0.585786 15.4142L12.5858 27.4142C13.3668 28.1953 14.6332 28.1953 15.4142 27.4142Z"
                  fill="white"></path>
              </svg>
            </a>
          </div>
        </>
      )
    }

    return ""
  }

  const renderMedia = () => {
    if (state.data.url_source) {
      if (
        state.data.type === "image" ||
        state.data.type === "update_cover" ||
        state.data.type === "update_avatar"
      ) {
        return <img ref={imageRef} src={state.data.url_source} />
      }

      if (state.data.type === "video") {
        return (
          <video autoPlay controls muted ref={imageRef}>
            <source src={state.data.url_source} />
          </video>
        )
      }
    }

    return <Skeleton.Image active={true} refs={imageRef} />
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => {
        handleCloseModal()
      }}
      className="feed modal-post-image-detail"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalBody>
        <div className="div-body">
          <button
            className="btn-back"
            onClick={() => {
              handleCloseModal()
            }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.7071 4.29289C20.0976 4.68342 20.0976 5.31658 19.7071 5.70711L5.70711 19.7071C5.31658 20.0976 4.68342 20.0976 4.29289 19.7071C3.90237 19.3166 3.90237 18.6834 4.29289 18.2929L18.2929 4.29289C18.6834 3.90237 19.3166 3.90237 19.7071 4.29289Z"
                fill="white"></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.29289 4.29289C4.68342 3.90237 5.31658 3.90237 5.70711 4.29289L19.7071 18.2929C20.0976 18.6834 20.0976 19.3166 19.7071 19.7071C19.3166 20.0976 18.6834 20.0976 18.2929 19.7071L4.29289 5.70711C3.90237 5.31658 3.90237 4.68342 4.29289 4.29289Z"
                fill="white"></path>
            </svg>
          </button>
          {renderDivBack()}
          <div className="div-left" ref={refDivLeft}>
            {renderMedia()}
          </div>

          <div className="div-right">
            <PerfectScrollbar
              options={{ wheelPropagation: false }}
              ref={refDivComment}>
              <div className="right-header">
                <PostHeader
                  data={state.data}
                  setData={setDataPost}
                  handleCloseModal={handleCloseModal}
                  dataModal={dataModal}
                  customAction={{
                    ...customAction,
                    delete_post: {
                      title: useFormatMessage(
                        "modules.feed.post.text.delete_image_video"
                      )
                    }
                  }}
                />
              </div>
              <div
                className="right-content"
                id={`post-body-content-${state.data?._id}`}>
                <RenderContentPost data={state.data} />
              </div>
              <div className="right-show-reaction">
                <PostShowReaction data={state.data} short={true} />
              </div>
              <div className="right-button">
                <ButtonReaction
                  data={state.data}
                  setData={setDataMedia}
                  comment_more_count_original={
                    state.comment_more_count_original
                  }
                  setCommentMoreCountOriginal={setCommentMoreCountOriginal}
                />
              </div>
              <div className="right-comment">
                <PostComment
                  data={state.data}
                  dataMention={dataMention}
                  setData={setDataMedia}
                  comment_more_count_original={
                    state.comment_more_count_original
                  }
                  setCommentMoreCountOriginal={setCommentMoreCountOriginal}
                  scrollToBottom={scrollToBottom}
                />
              </div>
            </PerfectScrollbar>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default PostImageDetailModal
