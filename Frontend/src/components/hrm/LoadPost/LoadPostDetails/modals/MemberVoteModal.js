import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage } from "@apps/utility/common"
import PerfectScrollbar from "react-perfect-scrollbar"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Modal, ModalBody } from "reactstrap"

const MemberVoteModal = (props) => {
  const { modal, toggleModal, dataUserVote, title = "" } = props
  const redux_list_user = useSelector((state) => state.users.list)
  const maxHeightScreen = "50vh" //screen.height - (screen.height * 50) / 100
  return (
    <Modal
      isOpen={modal}
      toggle={() => {
        toggleModal()
      }}
      className="modal-md feed modal-reaction-detail modal-member-vote"
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
            {title !== "" ? (
              title
            ) : (
              <>
                {dataUserVote.length}{" "}
                {useFormatMessage(
                  `modules.feed.create_post.text.${
                    dataUserVote.length > 1 ? "members_voted" : "member_voted"
                  }`
                )}
              </>
            )}
          </span>
        </div>

        <div className="div-member-vote">
          <PerfectScrollbar
            style={{
              maxHeight: maxHeightScreen
            }}
            options={{ wheelPropagation: false }}>
            {_.map(dataUserVote, (item, key) => {
              return (
                <div
                  key={key}
                  className="mb-1 d-flex align-items-center list-user-react">
                  <Avatar
                    className="img me-1"
                    src={redux_list_user[item]?.avatar}
                  />
                  <Link to={`/u/${redux_list_user[item]?.username}`}>
                    <span className="name">
                      {redux_list_user[item]?.full_name}
                    </span>
                  </Link>
                  <Link
                    to={`/chat/${redux_list_user[item]?.username}`}
                    className="ms-auto">
                    <button className="d-flex align-items-center direct-message-button">
                      <i className="fab fa-facebook-messenger me-50" />
                      {useFormatMessage("modules.workspace.buttons.messenge")}
                    </button>
                  </Link>
                </div>
              )
            })}
          </PerfectScrollbar>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default MemberVoteModal
