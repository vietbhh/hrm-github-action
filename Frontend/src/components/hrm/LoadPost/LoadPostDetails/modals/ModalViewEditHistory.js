import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
import { useEffect } from "react"
import { Modal, ModalBody } from "reactstrap"

const ModalViewEditHistory = (props) => {
  const { modal, toggleModal, post_id } = props
  const [state, setState] = useMergedState({
    loading: false,
    dataHistory: []
  })

  // ** useEffect
  useEffect(() => {
    if (modal && post_id) {
      setState({ loading: true })
      feedApi
        .getGetDataEditHistory(post_id)
        .then((res) => {
          setState({ loading: false, dataHistory: res.data })
        })
        .catch((err) => {
          setState({ loading: false })
        })
    }
  }, [modal, post_id])

  return (
    <Modal
      isOpen={modal}
      toggle={() => {
        toggleModal()
      }}
      className="feed modal-reaction-detail modal-member-vote modal-view-edit-history"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalBody>
        <button
          type="button"
          className="btn-close-modal"
          onClick={() => toggleModal()}>
          <i className="fa-sharp fa-solid fa-xmark"></i>
        </button>
        <div className="text-center mt-50">
          <span className="text-title">
            {useFormatMessage(`modules.feed.post.text.history`)}
          </span>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalViewEditHistory
