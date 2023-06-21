import { ErpInput } from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage } from "@apps/utility/common"
import { Modal, ModalBody, ModalHeader } from "reactstrap"

const ModalSendInMessenger = (props) => {
  const { modal, toggleModal, title = "" } = props

  return (
    <Modal
      isOpen={modal}
      toggle={() => {
        toggleModal()
      }}
      className="modal-md feed modal-create-post modal-send-in-messenger"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader>
        <div className="div-header-title">
          <span className="text-title">
            {title !== ""
              ? title
              : useFormatMessage(
                  `modules.feed.post.modal_send_in_messenger.title`
                )}
          </span>
          <div
            className="div-btn-close"
            onClick={() => toggleModalCreatePost()}>
            <i className="fa-regular fa-xmark"></i>
          </div>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="div-content-post">
          <div className="div-content-post__content">
            <div className="content-header">
              <Avatar className="img" src={""} />
              <div className="content-header__name">
                <span className="name-title">Life. HR</span>
                <span className="name-time">June 10, 2023</span>
              </div>
            </div>
            <div className="content-body">
              Tối nay ăn gì? of working in an international company is sharing
              knowledge with your colleagues Tối nay ăn gì? of working in an
              international company is sharing knowledge with your colleagues
            </div>
          </div>
          <div className="div-content-post__image">
            <img src="https://picsum.photos/id/237/200/300" />
          </div>
        </div>
        <div className="div-input-editor">
          <Avatar className="img" src={""} />
          <ErpInput
            nolabel
            placeholder={useFormatMessage(
              "modules.feed.post.modal_send_in_messenger.say_something"
            )}
          />
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalSendInMessenger
