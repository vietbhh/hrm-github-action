// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { getBadgeFromKey } from "@modules/FriNet/common/common"
// ** Styles
import {
    Modal,
    ModalBody,
    ModalHeader
  } from "reactstrap"
// ** Components

const ModalChooseBadge = (props) => {
  const {
    // ** props
    listBadge,
    modalChooseBadge,
    // ** methods
    toggleModalChooseBadge,
    setState
  } = props

  // ** render
  return (
    <Modal
      isOpen={modalChooseBadge}
      toggle={() => toggleModalChooseBadge()}
      className="feed modal-dialog-centered modal-create-post modal-create-event modal-choose-badge"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader>
        <button className="btn-icon-header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none">
            <path
              d="M12.5249 14.235H5.47491C5.15991 14.235 4.8074 13.9875 4.7024 13.6875L1.59741 5.00249C1.15491 3.75749 1.67241 3.37499 2.73741 4.13999L5.66241 6.23249C6.14991 6.56999 6.70491 6.39749 6.91491 5.84999L8.23491 2.33249C8.65491 1.20749 9.35241 1.20749 9.77241 2.33249L11.0924 5.84999C11.3024 6.39749 11.8574 6.56999 12.3374 6.23249L15.0824 4.27499C16.2524 3.43499 16.8149 3.86249 16.3349 5.21999L13.3049 13.7025C13.1924 13.9875 12.8399 14.235 12.5249 14.235Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.875 16.5H13.125"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.125 10.5H10.875"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="text-title">
          {useFormatMessage("modules.feed.create_post.endorsement.list_badges")}
        </span>
        <div className="div-btn-close" onClick={() => toggleModalChooseBadge()}>
          <i className="fa-solid fa-xmark"></i>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="div-list-badge">
          {_.map(listBadge, (item, index) => {
            return (
              <div
                key={index}
                className="div-item-badge"
                onClick={() => {
                  setState({
                    valueBadge: {
                      name: item.name,
                      badge: item.badge,
                      url: item.url ? item.url : "",
                      badge_type: item.badge_type
                    },
                    modalChooseBadge: false
                  })
                }}>
                <div className="div-img">
                  <img
                    src={
                      item.badge_type === "local"
                        ? getBadgeFromKey(item.badge)
                        : item.url
                    }
                  />
                </div>
                <div className="div-text">“{item.name}”</div>
              </div>
            )
          })}
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalChooseBadge
