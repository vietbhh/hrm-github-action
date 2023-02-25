import { downloadApi } from "@apps/modules/download/common/api"
import {
  timeDifference,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { Skeleton } from "antd"
import { useEffect } from "react"
import { Label, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap"
import PerfectScrollbar from "react-perfect-scrollbar"
import Avatar from "@apps/modules/download/pages/Avatar"
import ReactHtmlParser from "react-html-parser"
import ButtonReaction from "../ButtonReaction"

const PostImageDetailModal = (props) => {
  const {
    modal,
    toggleModal,
    dataModal,
    idImage,
    setIdImage,
    postType,
    dataMedias
  } = props
  const [state, setState] = useMergedState({
    data: {},
    id_previous: "",
    id_next: ""
  })

  // ** useEffect
  useEffect(() => {
    if (postType === "post") {
      const indexMedia = dataMedias.findIndex((item) => item._id === idImage)
      if (indexMedia !== -1) {
        const id_next = dataMedias[indexMedia + 1]
          ? dataMedias[indexMedia + 1]._id
          : dataMedias[0]._id
        const id_previous = dataMedias[indexMedia - 1]
          ? dataMedias[indexMedia - 1]._id
          : dataMedias[dataMedias.length - 1]._id
        setState({ id_previous: id_previous, id_next: id_next })
        const _data = { ...dataMedias[indexMedia] }
        downloadApi.getPhoto(dataMedias[indexMedia].source).then((response) => {
          _data["url_source"] = URL.createObjectURL(response.data)
          setState({ data: _data })
        })
      } else {
        setState({ data: {}, id_previous: "", id_next: "" })
      }
    }

    if (postType === "image") {
      const _data = { ...dataModal }
      downloadApi.getPhoto(_data.source).then((response) => {
        _data["url_source"] = URL.createObjectURL(response.data)
        setState({ data: _data })
      })
    }
  }, [idImage, postType, dataMedias])

  // ** render
  const renderDivBack = () => {
    if (postType === "post") {
      return (
        <>
          <div className="div-back left">
            <a
              className="slide-navigator"
              onClick={(e) => {
                e.preventDefault()
                setIdImage(state.id_previous)
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
          <div className="div-back right">
            <a
              className="slide-navigator"
              onClick={(e) => {
                e.preventDefault()
                setIdImage(state.id_next)
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
      if (state.data.type === "image") {
        return <img src={state.data.url_source} />
      }

      if (state.data.type === "video") {
        return (
          <video controls muted>
            <source src={state.data.url_source}></source>
          </video>
        )
      }
    }

    return <Skeleton.Image active={true} />
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => toggleModal()}
      className="feed modal-post-image-detail"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalBody>
        <div className="div-body">
          <button className="btn-back" onClick={() => toggleModal()}>
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
          <div className="div-left">{renderMedia()}</div>

          <div className="div-right">
            <PerfectScrollbar options={{ wheelPropagation: false }}>
              <div className="right-header">
                <Avatar className="img" src={dataModal?.user_data?.avatar} />
                <div className="right-header__title">
                  <span className="name">
                    {dataModal?.user_data?.full_name}
                  </span>
                  <span className="time">
                    {timeDifference(dataModal.created_at)}
                  </span>
                </div>
                <div className="right-header__right">
                  <div className="button-dot cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="4"
                      viewBox="0 0 18 4"
                      fill="none">
                      <path
                        d="M9 3C9.5523 3 10 2.5523 10 2C10 1.4477 9.5523 1 9 1C8.4477 1 8 1.4477 8 2C8 2.5523 8.4477 3 9 3Z"
                        stroke="#B0B7C3"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 3C16.5523 3 17 2.5523 17 2C17 1.4477 16.5523 1 16 1C15.4477 1 15 1.4477 15 2C15 2.5523 15.4477 3 16 3Z"
                        stroke="#B0B7C3"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 3C2.55228 3 3 2.5523 3 2C3 1.4477 2.55228 1 2 1C1.44772 1 1 1.4477 1 2C1 2.5523 1.44772 3 2 3Z"
                        stroke="#B0B7C3"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="right-content">
                {ReactHtmlParser(state.data?.content)}
              </div>
              <div className="right-button">
                <ButtonReaction />
              </div>
              <div className="right-comment-content"></div>
              <div className="right-comment-form"></div>
            </PerfectScrollbar>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default PostImageDetailModal
