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
        <div className="div-send-to">
          <ErpInput
            label={useFormatMessage(
              "modules.feed.post.modal_send_in_messenger.send_to"
            )}
            placeholder={useFormatMessage(
              "modules.feed.post.modal_send_in_messenger.enter_email_or_username"
            )}
            prepend={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none">
                <path
                  d="M9.58341 17.5C13.9557 17.5 17.5001 13.9556 17.5001 9.58334C17.5001 5.21108 13.9557 1.66667 9.58341 1.66667C5.21116 1.66667 1.66675 5.21108 1.66675 9.58334C1.66675 13.9556 5.21116 17.5 9.58341 17.5Z"
                  stroke="#969191"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.3334 18.3333L16.6667 16.6667"
                  stroke="#969191"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </div>
        <div className="div-recent">
          <label className="form-label mb-1">
            {useFormatMessage(
              "modules.feed.post.modal_send_in_messenger.recent"
            )}
          </label>

          <div className="recent-item">
            <Avatar className="img" src={""} />
            <span className="recent-item__text">Life. HR</span>
            <button className="recent-item__button">Send</button>
          </div>
          <div className="recent-item">
            <Avatar className="img" src={""} />
            <span className="recent-item__text">Life. HR</span>
            <button className="recent-item__button">Send</button>
          </div>
          <div className="recent-item">
            <Avatar className="img" src={""} />
            <span className="recent-item__text">Life. HR</span>
            <button className="recent-item__button">Send</button>
          </div>
          <div className="recent-item">
            <Avatar className="img" src={""} />
            <span className="recent-item__text">Life. HR</span>
            <button className="recent-item__button">Send</button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalSendInMessenger
