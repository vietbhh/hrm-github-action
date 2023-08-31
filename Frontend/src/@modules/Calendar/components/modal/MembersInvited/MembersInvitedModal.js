// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap"
// ** Components
import PerfectScrollbar from "react-perfect-scrollbar"
import Avatar from "@apps/modules/download/pages/Avatar"

const MembersInvitedModal = (props) => {
  const {
    // ** props
    modal,
    listMember,
    // ** methods
    handleModal
  } = props

  const handleClickMessenge = (item) => {
    window.open(`/chat/${item.username}`, "_blank", "noopener,noreferrer")
  }

  // ** render
  return (
    <Modal
      isOpen={modal}
      toggle={() => handleModal()}
      className="modal-dialog-centered feed modal-create-post modal-create-event modal-custom-repeat modal-member-invited"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader>
        <span className="text-title">
          {useFormatMessage("modules.feed.create_post.text.member_invited", {
            number: listMember.length
          })}
        </span>
        <div className="div-btn-close" onClick={() => handleModal()}>
          <i className="fa-regular fa-xmark"></i>
        </div>
      </ModalHeader>
      <ModalBody>
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <div className="w-100 mt-2 member-invited-list">
            {listMember.map((item, index) => {
              return (
                <div
                  className="d-flex algin-items-center justify-content-between mb-75 member-invited-item"
                  key={`member-invited-item-${index}`}>
                  <div className="d-flex align-items-center">
                    <Avatar
                      src={item.avatar}
                      imgWidth="28"
                      imgHeight="28"
                      className="me-50"
                    />
                    <p className="mb-0">{item.label}</p>
                  </div>
                  <div>
                    <Button.Ripple
                      className=" d-flex align-items-center custom-button custom-primary"
                      onClick={() => handleClickMessenge(item)}>
                      <i className="fab fa-facebook-messenger me-50" />
                      {useFormatMessage("modules.workspace.buttons.messenge")}
                    </Button.Ripple>
                  </div>
                </div>
              )
            })}
          </div>
        </PerfectScrollbar>
      </ModalBody>
    </Modal>
  )
}

export default MembersInvitedModal
