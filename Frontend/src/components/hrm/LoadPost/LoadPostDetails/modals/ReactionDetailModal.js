import { downloadApi } from "@apps/modules/download/common/api"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useEffect, useRef } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import { Modal, ModalBody } from "reactstrap"
import { Tabs } from "antd"
import img_care from "@modules/Feed/assets/images/care.png"
import img_smile from "@modules/Feed/assets/images/haha.png"
import img_like from "@modules/Feed/assets/images/like.png"
import img_love from "@modules/Feed/assets/images/love.png"
import img_sad from "@modules/Feed/assets/images/sad.png"
import img_wow from "@modules/Feed/assets/images/wow.png"

const ReactionDetailModal = (props) => {
  const { modal, toggleModal, dataReaction } = props
  const [state, setState] = useMergedState({})

  // ** function
  const renderImageReact = (type) => {
    switch (type) {
      case "like":
        return <img src={img_like} />

      case "love":
        return <img src={img_love} />

      case "care":
        return <img src={img_care} />

      case "smile":
        return <img src={img_smile} />

      case "sad":
        return <img src={img_sad} />

      case "wow":
        return <img src={img_wow} />

      default:
        return useFormatMessage("modules.feed.post.text.other")
    }
  }

  const items = [
    {
      key: "all",
      label: useFormatMessage("modules.feed.post.text.all"),
      children: `Content of Tab Pane`
    },

    ..._.map(dataReaction, (value, index) => {
      return {
        key: index,
        label: (
          <div className="d-flex align-items-center">
            {renderImageReact(index)}{" "}
            <span className="ms-50">{value.length}</span>
          </div>
        ),
        children: `Content of Tab Pane ${index}`
      }
    })
  ]

  return (
    <Modal
      isOpen={modal}
      toggle={() => {
        toggleModal()
      }}
      className="modal-md modal-dialog-centered feed modal-reaction-detail"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalBody>
        <button
          type="button"
          className="btn-close-modal"
          onClick={() => toggleModal()}>
          <i className="fa-sharp fa-solid fa-xmark"></i>
        </button>
        <Tabs defaultActiveKey="1" items={items} />
      </ModalBody>
    </Modal>
  )
}

export default ReactionDetailModal
