import { downloadApi } from "@apps/modules/download/common/api"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Skeleton } from "antd"
import { useEffect } from "react"
import { Label, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap"
const PostImageDetailModal = (props) => {
  const { modal, toggleModal, dataModal, idImage, setIdImage, postType } = props
  const [state, setState] = useMergedState({
    data: {}
  })

  // ** useEffect
  useEffect(() => {
    console.log(dataModal)
    if (postType === "post") {
      const _data = {}

      /* _data[idImage] = dataModal
      downloadApi.getPhoto(dataModal.source).then((response) => {
        _data[idImage]["url_source"] = URL.createObjectURL(response.data)
        setState({ data: _data })
      }) */
    }

    if (postType === "image") {
    }
  }, [dataModal, postType])

  useEffect(() => {
    if (postType === "post") {
    }

    if (postType === "image") {
      const _data = {}
      _data[idImage] = { ...dataModal }
      downloadApi.getPhoto(_data[idImage].source).then((response) => {
        _data[idImage]["url_source"] = URL.createObjectURL(response.data)
        setState({ data: _data })
      })
    }
  }, [idImage, postType])

  // ** render
  const renderDivBack = () => {
    if (postType === "post") {
      return (
        <>
          <div className="div-back left">
            <a className="slide-navigator">
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
            <a className="slide-navigator">
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

  return (
    <Modal
      isOpen={modal}
      toggle={() => toggleModal()}
      className="feed modal-post-image-detail"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalBody>
        <div className="div-body">
          <button className="btn-back">
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
          <div className="div-left">
            {state.data[idImage]?.url_source ? (
              <img src={state.data[idImage].url_source} />
            ) : (
              <Skeleton.Image active={true} />
            )}
          </div>
          <div className="div-right"></div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default PostImageDetailModal
